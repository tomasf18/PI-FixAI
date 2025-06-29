## External imports
import os
from typing import Tuple
from fastapi import HTTPException, status, Depends, APIRouter, Response
from fastapi.security import OAuth2PasswordRequestForm

## Internal imports
from dto.auth import Tokens, Auth, UserAuth, CurrentUser, EmailRequest, ConfirmCodeRequest, Token, NewPasswordRequest
from dto.user import UserCreate
from services.auth import AuthService, get_current_active_user, create_refresh_token
from config import ENDPOINTS_PREFIX, ACCESS_TOKEN_EXPIRES_MINUTES, REFRESH_TOKEN_EXPIRES_DAYS, HTTPS_ENABLED
from datetime import timedelta  
from services.auth import create_token, decode_token
from uuid import UUID
from utils.logger import logger

auth_router = APIRouter(
    prefix=f"{ENDPOINTS_PREFIX}/auth",
    tags=["Auth"]
)

# ======================== AUTH ROUTES ========================

# Called upon login to get the token (the frontend requests this route to get the token, so that whenever a new request is made, the token is sent in the header to the backend for authentication)
# The response_model parameter is used to validate the response, so the response must be a Token model
@auth_router.post("/log-in", response_model=Tokens)
async def login_for_access_token(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), is_user: bool = True) -> Tokens:
    tokens = await AuthService.login(form_data, is_user)
    logger.info(f"Is https enabled: {HTTPS_ENABLED}, type: {type(HTTPS_ENABLED)}")
    
    if not is_user:
        response.set_cookie(
            key="accessToken",
            value=tokens.access_token,
            httponly=True,
            secure=True if HTTPS_ENABLED else False,
            samesite="None" if HTTPS_ENABLED else "Strict",
            max_age=ACCESS_TOKEN_EXPIRES_MINUTES * 60      # Adjust max_age (in seconds) as needed
        )

        response.set_cookie(
            key="refreshToken",
            value=tokens.refresh_token,
            httponly=True,
            secure=True if HTTPS_ENABLED else False,
            samesite="None" if HTTPS_ENABLED else "Strict",
            max_age=216000 * 60
        )
        return Tokens(access_token="", token_type="", refresh_token="")

    return tokens
# Called upon sign-up to create a new user

@auth_router.post("/sign-up", status_code=status.HTTP_200_OK)
async def sign_up(email: EmailRequest):
    if await AuthService.email_exists(email.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return await AuthService.insert_confirmation_code(email.email)

@auth_router.post("/sign-out", status_code=status.HTTP_200_OK)
async def sign_out(response: Response, current_user_data: CurrentUser = Depends(get_current_active_user)):
    response.delete_cookie("accessToken", path="/")
    return current_user_data.current_user.email

# Now we are gonna create routes that are authenticated (rely on the fact that we are signed in and have a valid token, depending on the get_current_active_user function)
@auth_router.get("/users/me", response_model=UserCreate)
async def read_users_me(current_user_data: CurrentUser = Depends(get_current_active_user)):
    name: str = await AuthService.get_user_name(UUID(current_user_data.token.get("user_id")))
    email: str = current_user_data.current_user.email
    return UserCreate(name=name, email=email, password="")
    
@auth_router.put("/user-profile", response_model=Tokens) 
async def update_user_profile(user: UserCreate, update: bool, current_user_data: CurrentUser = Depends(get_current_active_user)) -> Tokens: 
    if not await AuthService.verify_password(user.password, current_user_data.current_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect password")
    if update: 
        return await AuthService.update_user_profile(user, current_user_data)
    else:
        logger.info(f"\nUser email: {user.email}")
        if await AuthService.email_exists(user.email):
            raise HTTPException(status_code=400, detail="Email already registered")
        await AuthService.insert_confirmation_code(user.email) 
        return Tokens(access_token="", token_type="", refresh_token="")

@auth_router.post("/update-code-confirmation", response_model=Tokens)
async def update_code_confirmation(
    confirm_code_request: ConfirmCodeRequest,
    current_user_data: CurrentUser = Depends(get_current_active_user)
) -> Tokens:
    code = confirm_code_request.code
    user: UserCreate = UserCreate(
        name=confirm_code_request.name,
        email=confirm_code_request.email,
        password=confirm_code_request.password
    )
    # Confirm the code
    await AuthService.confirm_code(user.email, code)

    # Update the user profile
    return await AuthService.update_user_profile(user, current_user_data)

@auth_router.post("/forgotten-password", status_code=status.HTTP_200_OK)
async def forgot_password(email: EmailRequest):
    if not await AuthService.email_exists(email.email):
        raise HTTPException(status_code=400, detail="Email not registered")
    return await AuthService.insert_confirmation_code(email.email)  

@auth_router.post("/new-password")
async def new_password(new_password_request: NewPasswordRequest):
    code = new_password_request.code
    email = new_password_request.email
    await AuthService.confirm_code(email, code)
    new_password = new_password_request.new_password
    await AuthService.new_password(email, new_password)
    return status.HTTP_200_OK

@auth_router.delete("/user-profile")
async def delete_user(user: UserCreate, current_user_data: CurrentUser = Depends(get_current_active_user)):
    email: str = current_user_data.current_user.email
    user_id: UUID = UUID(current_user_data.token.get("user_id"))
    if current_user_data.token.get("organization_id"):
        raise HTTPException(status_code=403, detail="You are not allowed to make this operation")
    
    if not await AuthService.verify_password(user.password, current_user_data.current_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect password")
    
    return await AuthService.delete_user(email, user_id)

@auth_router.post("/code-confirmation", status_code=status.HTTP_201_CREATED)
async def mail_confirmation(confirm_code_request: ConfirmCodeRequest):
    code = confirm_code_request.code
    user: UserCreate = UserCreate(
        name=confirm_code_request.name,
        email=confirm_code_request.email,
        password=confirm_code_request.password
    )
    await AuthService.confirm_code(user.email, code)
    return await AuthService.sign_up(user)

@auth_router.post("/resend-code", status_code=status.HTTP_200_OK)
async def resend_code(email: EmailRequest):
    return await AuthService.insert_confirmation_code(email.email)

@auth_router.get("/refresh-token", response_model=Tokens)
async def refresh_token(response: Response, current_user_data: CurrentUser = Depends(get_current_active_user)):
    # (3. get invalid access token and refresh exp && return <accesse_toke>, <refresh_token>)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
    current_user = current_user_data.current_user 
    new_access_token = await create_token(
        data={
            "user_id": current_user.user_id if hasattr(current_user, "user_id") else current_user.operator_id,
            "email": current_user.email, 
            "organization_id": current_user.organization_id if hasattr(current_user, "organization_id") else None,
            "type": "access"
        },
        expires_delta=access_token_expires
    )

    refresh_token_expires = timedelta(days=REFRESH_TOKEN_EXPIRES_DAYS)
    new_refresh_token = await create_token(
        data={
            "user_id": "",
            "email": current_user.email,
            "organization_id": "",
            "type": "refresh"
        },
        expires_delta=refresh_token_expires
    )
    
    await create_refresh_token(new_refresh_token)

    if hasattr(current_user, "organization_id") and current_user.organization_id:
        response.set_cookie(
            key="accessToken",
            value=new_access_token,
            httponly=True,
            secure=True if HTTPS_ENABLED else False,
            samesite="None" if HTTPS_ENABLED else "Strict",
            max_age=ACCESS_TOKEN_EXPIRES_MINUTES * 60      # Adjust max_age (in seconds) as needed
        )
        response.set_cookie(
            key="refreshToken",
            value=new_refresh_token,
            secure=True if HTTPS_ENABLED else False,
            samesite="None" if HTTPS_ENABLED else "Strict",
            max_age=216000 * 60
        )
        return Tokens(access_token="", token_type="", refresh_token="")

    return Tokens(access_token=new_access_token, token_type="bearer", refresh_token=new_refresh_token)