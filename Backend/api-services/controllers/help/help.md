from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext

SECRET_KEY = "8cdad8418c9de37e05df5e23b06328e3ebddf46601897cbdacc4b3da9b2f5336" # openssl rand -hex 32
ALGOTITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()


db = {
    "john": {
        "username": "john",
        "full_name": "John Doe",
        "email": "john@email.com",
        "hashed_password": "$2b$12$bYyAccrY1zRyTc1ToAmq2O8SKi0.e.VbAhsHvK6IeHDghUKKgctzG",
        "disabled": False
    }
}

class Token(BaseModel):
    access_token: str
    token_type: str
    

class TokenData(BaseModel): # data encoded in the token
    username: str = None
   
class User(BaseModel):
    username: str
    email: str = None
    full_name: str = None
    disabled: bool = None
    
class UserInDB(User):
    hashed_password: str
    

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") # bcrypt is the hashing algorithm, deprecated auto means we are going to us the default hashing algorithm
oauth_2_scheme = OAuth2PasswordBearer(tokenUrl="token") # define where we go to retrieve our access token

# Utility functions to authenticate users and hash their passwords
def vetify_password(plain_password, hashed_password): 
    """ Hashes the plain password and compares it to the hashed password in the database """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """ Hashes the password """
    return pwd_context.hash(password)

def get_user(db, username: str):
    """ Retrieve a user from the database """
    if username in db:
        user_data = db[username]
        return UserInDB(**user_data) # unpack the user data into a UserInDB object model
    
def authenticate_user(db, username: str, password: str):
    """ Authenticate a user """
    user = get_user(db, username)
    if not user:
        return False
    if not vetify_password(password, user.hashed_password):
        return False
    return user

def create_token(data: dict, expires_delta: timedelta = None):
    """ Create an access token """
    to_encode = data.copy() # Copy the dict so if we make any changes it doesn't affect the original data
    # Set the expiration time for the token (default is 15 minutes)
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta # this case means we are setting a custom expiration time
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15) # this case means we are using the default expiration time
    to_encode.update({"exp": expire}) # add the expiration time to the token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGOTITHM) # encode the token
    return encoded_jwt

# Get user from an access token
async def get_current_user(token: str = Depends(oauth_2_scheme)): # the Depends() calls the oauth_2_scheme function, which is gonna parse the token and put it in the "token" parameter
                                                                    # Basically, it calls the function and passes the result to the parameter before we run the endpoint function
    """ Get the current user from the access token """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGOTITHM])
        username: str = payload.get("sub") # sub is the subject of the token, which is the username
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    user = get_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

# Create an access token based on login credentials
async def get_current_active_user(current_user: UserInDB = Depends(get_current_user)):
    """ 
    Get the current active user 
    We could use only get_current_user, but we want to check if the user is active,
    because we may want to disable users without deleting their accounts
    """
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# =======

@app.post("/token", response_model=Token) # This route is going to be called whe we are logging in with a username and password and will return the access token wich we can use
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()): # Means that the data we are receiving from the form to generate a JWT token is an username and password, and that's what is specified by OAuth2PasswordRequestForm
                                                                                    # The Depends() here means we are going to use the OAuth2PasswordRequestForm to parse the form data
                                                                                    # Once we have this data, we can use it to generate the token
    """ Login endpoint """
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_token(data={"sub": user.username}, expires_delta=access_token_expires) # the data is what we want to encode
    return {"access_token": access_token, "token_type": "bearer"} # this return must be like this because it's the Token model required in the response ("response_model=Token")


# Now we are gonna create routes that are authenticated (rely on the fact that we are signed in and have a valid token)
# Since both of the following routes depend on the get_current_active_user function, they will only be called if the user is signed in and has a valid token
@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """ Get the current user """
    return current_user

@app.get("/users/me/items")
async def read_own_items(current_user: User = Depends(get_current_active_user)):
    """ Get the current user's items """
    return [{"item_id": 1, "owner": current_user}] # simulating the user's items on the database

# On the frontend what we are going to do is to send a POST request to /token with the username and password in the body (login), and we are going to get back the access token
# Then, on successive requests, we are going to send the access token in the Authorization header, and the backend is going to use the token to authenticate the user
# The token is going to be valid for 15 minutes by default, but we can change that by passing an expires_delta parameter to the
# create_token function, which is going to be the expiration time of the token
# The token is going to be encoded with the user's username, so we can use it to get the user from the database
# When the token expires, the user is going to have to log in again to get a new token OR it can be refreshed in case the user is still logged in


password = get_password_hash("1234")
logger.info(password)