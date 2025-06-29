## External imports
import os
from datetime import timedelta
from fastapi import HTTPException, Depends, Request, status, Security
from passlib.context import CryptContext
from uuid import UUID
from fastapi.security import APIKeyHeader, OAuth2PasswordRequestForm
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import random

## Internal imports
from dto.auth import Tokens, OperatorAuth, CurrentUser, UserAuth, Auth
from dto.user import UserCreate
from repository import auth, app_data
from utils.auth import create_token, decode_token, credentials_exception
from config import ACCESS_TOKEN_EXPIRES_MINUTES, REFRESH_TOKEN_EXPIRES_DAYS, FIX_AI_EMAIL, SENDGRID_API_KEY
from utils.logger import logger

# ======================== AUTH SERVICE ========================

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") # default hashing algorithm
auth_token = APIKeyHeader(name="Authorization", auto_error=False) # get the token from the header

class AuthService:
    
    @staticmethod
    def isUser(token: dict) -> bool:
        """ Check if the user is a user or an operator """
        if token.get("organization_id"):
            return False
        return True
    
    @staticmethod
    async def login(form_data: OAuth2PasswordRequestForm, is_user: bool) -> Tokens:
        user = await AuthService.authenticate_user(form_data.username, form_data.password, is_user) # username = email
        if not user:
            raise HTTPException(status_code=400, detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
        refresh_token_expires = timedelta(days=REFRESH_TOKEN_EXPIRES_DAYS)
        access_token = await create_token(
            data={
                "user_id": user.user_id if is_user else user.operator_id,
                "email": user.email,
                "organization_id": user.organization_id if not is_user else None,
                "type": "access"
            }, 
            expires_delta=access_token_expires
        ) 
        
        refresh_token = await create_token(
            data={
                "user_id": "",
                "email": user.email,
                "organization_id": "",
                "type": "refresh"
            },
            expires_delta=refresh_token_expires
        )
        
        await create_refresh_token(refresh_token)
        
        return Tokens(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
    
    @staticmethod
    async def sign_up(user: UserCreate):
        # Check if the user already exists
        existing_user = await auth.User.get_user(user.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        user.password = await AuthService.get_password_hash(user.password)
        new_user_id = await auth.User.create_user_auth(user)
        await app_data.UserProfile.create_user_profile(new_user_id, user)
        return status.HTTP_201_CREATED
    
    @staticmethod
    async def new_password(email: str, new_password: str):
        new_password_hash = await AuthService.get_password_hash(new_password)
        await auth.User.update_password(email, new_password_hash)
        return status.HTTP_200_OK
        
        
    @staticmethod
    async def sign_out(user: Auth):
        return {"message": "User sign-out successfully"}
    
    @staticmethod
    async def get_auth_info(email: str, is_user: bool) -> Auth:
        if is_user:
            result = await auth.User.get_user(email)
            
            if not result:
                return None
            
            result = result.one()
            
            return UserAuth(
                email=result.get("email"),
                password_hash=result.get("password_hash"),
                created_at=result.get("created_at"),
                user_id=result.get("user_id")
            )
        else:
            result = await auth.Operator.get_operator(email)
            
            if not result:
                return None
            
            result = result.one()
            
            return OperatorAuth(
                email=result.get("email"),
                password_hash=result.get("password_hash"),
                created_at=result.get("created_at"),
                organization_id=result.get("organization_id"),
                operator_id=result.get("operator_id")
            )
    
    @staticmethod  
    async def authenticate_user(email: str, password: str, is_user: bool) -> Auth:
        user = await AuthService.get_auth_info(email, is_user)
        if not user:
            return False
        if not await AuthService.verify_password(password, user.password_hash):
            return False
        return user
    
    @staticmethod
    async def verify_password(plain_password, hashed_password) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    async def get_password_hash(password) -> str:
        return pwd_context.hash(password)
    
    @staticmethod
    async def update_user_profile(user: UserCreate, current_user_data: CurrentUser) -> Tokens:
        current_user: Auth = current_user_data.current_user
        token: dict = current_user_data.token 
        if not AuthService.isUser(token):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not allowed to make this operation")
        
        current_user: UserAuth = UserAuth(
            email=current_user.email,
            password_hash=current_user.password_hash,
            created_at=current_user.created_at,
            user_id=token.get("user_id")
        )
        
        if user.email != current_user.email:
            if await auth.User.get_user(user.email):
                raise HTTPException(status_code=400, detail="Email already registered")
            await auth.User.update_email(current_user.email, user.email, current_user.password_hash, current_user.created_at, current_user.user_id)

        await app_data.UserProfile.update_user_name(current_user.user_id, user.name)

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
        refresh_token_expires = timedelta(days=REFRESH_TOKEN_EXPIRES_DAYS)
        
        access_token = await create_token(
            data={
                "user_id": current_user.user_id,
                "email": user.email,
                "organization_id": None,
                "type": "access"
            }, 
            expires_delta=access_token_expires
        )
        
        refresh_token = await create_token(
            data={
                "user_id": "",
                "email": user.email,
                "organization_id": "",
                "type": "refresh"
            },
            expires_delta=refresh_token_expires
        )
        
        await create_refresh_token(refresh_token)
        
        return Tokens(access_token=access_token, refresh_token=refresh_token, token_type="bearer")
    
    @staticmethod
    async def get_user_name(user_id: UUID) -> str:
        return await app_data.UserProfile.get_user_name(user_id)
    
    @staticmethod
    async def delete_user(email: str, user_id: UUID):
        await auth.User.delete_user(email)
        await app_data.UserProfile.delete_user(user_id)
        return {"message": "User deleted successfully"}
    
    @staticmethod
    async def insert_confirmation_code(email: str):
        # code = str(random.randint(100000, 999999))
        code = "525082"
        await auth.ConfirmationCodes.insert_confirmation_code(email, code)
        await send_email(email, code)
        return {"message": "Code sent successfully"}
    
    @staticmethod
    async def confirm_code(email: str, code: str):
        result = await auth.ConfirmationCodes.get_confirmation_code(email)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Confirmation code with email '{email}' not found"
            )
        
        db_code = result.one().get("code")
        
        # Ensure both codes are strings before comparison
        if str(db_code) != str(code):
            logger.info(f"Code from db: {db_code}")
            logger.info(f"Code from user: {code}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid confirmation code"
            )
        
        return status.HTTP_200_OK
    
    @staticmethod
    async def email_exists(email: str) -> bool:
        if await auth.User.get_user(email):
            return True
        return False

async def oauth2_cookie_or_header(request: Request, token: str = Security(auth_token)) -> str:
    if token:
        return token
    
    token_use = request.headers.get("X-Token-Use")
    access_token = request.cookies.get("accessToken")
    refresh_token = request.cookies.get("refreshToken")
    
    if token_use == "refresh":
        if refresh_token:
            token = refresh_token
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token missing",
                headers={"WWW-Authenticate": "Bearer"},
            )
    else:
        token = access_token

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return token

async def get_current_user(token: str = Depends(oauth2_cookie_or_header)) -> CurrentUser:
    """ Get the current user from the access token """
    token_data = decode_token(token)
    # check type && got check db (1. delete and replace with a new with a TTL=OLD_TTL-Timealreadypassed; 2. return new refresh tooken)
    type = token_data.type
    if type == "access":
        user = await AuthService.get_auth_info(email=token_data.email, is_user=token_data.organization_id is None)
        if user is None:
            raise credentials_exception
        return CurrentUser(current_user=user, token=token_data.model_dump())
    else:
        if not await is_refresh_token_in_db(token):
            raise credentials_exception
        is_user = not await has_organization(token_data.email)
        user = await AuthService.get_auth_info(email=token_data.email, is_user=is_user)
        if user is None:
            raise credentials_exception
        return CurrentUser(current_user=user, token=token_data.model_dump())
        

async def get_current_active_user(current_user_data: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    """ Get the current active user """
    return current_user_data

async def send_email(email: str, code: str):
    message = Mail(
        from_email=FIX_AI_EMAIL,
        to_emails=email,
        subject='Your Confirmation Code for FixAI',
        html_content=f'''
        <html>
            <body>
                <h1>Welcome to FixAI!</h1>
                <p>Thank you for signing up. Your confirmation code is:</p>
                <h2>{code}</h2>
                <p>Please enter this code in the app to verify your email address.</p>
                <p>If you did not sign up for FixAI, please ignore this email.</p>
                <br>
                <p>Best regards,</p>
                <p>The FixAI Team</p>
            </body>
        </html>
        ''')
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
    except Exception as e:
        logger.info(e.body)

async def is_refresh_token_in_db(token: str) -> bool:
    """ Check if the refresh token is valid """
    token_in_db = await auth.RefreshTokens.get_refresh_token(token)
    if not token_in_db:
        return False
    return True

async def has_organization(email: str) -> bool:
    """ Check if the user has an organization """
    operator = await auth.Operator.get_operator(email)
    if not operator:
        return False
    return True

async def create_refresh_token(token: str):
    """ Create a refresh token """
    await auth.RefreshTokens.insert_refresh_token(token)