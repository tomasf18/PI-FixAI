# External imports
from fastapi import HTTPException, status
from uuid import UUID
from jose import JWTError, jwt, ExpiredSignatureError
from datetime import datetime, timedelta, timezone
from typing import Optional

# Internal imports
from dto.auth import TokenData
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRES_MINUTES
from utils.logger import logger

# ======================== AUTH UTILS ========================

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"} # these headers are used to tell the client that the server is expecting a token (are sent via protocol)
)

expiring_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Token has expired",
    headers={"WWW-Authenticate": "Bearer"}
)

async def create_token(data: dict, expires_delta: timedelta = None) -> str:
    """ Create an access token with a custom expiration time """
    to_encode = data.copy()     # Copy the dict so if we make any changes it doesn't affect the original data
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
    to_encode["user_id"] = str(to_encode["user_id"]) # convert the UUID to a string
    to_encode["organization_id"] = str(to_encode["organization_id"]) if to_encode.get("organization_id") else None # convert the UUID to a string
    to_encode.update({"exp": expire}) # add the expiration time to the token (we have the initial data - e.g. user_id, email - and now we add the expiration time)
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> TokenData:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        logger.info(payload)
        user_id: UUID = payload.get("user_id")
        email: str = payload.get("email")
        organization_id: Optional[UUID] = payload.get("organization_id")
        type = payload.get("type")
        if (user_id is None or email is None):
            raise credentials_exception
        token_data = TokenData(user_id=user_id, email=email, organization_id=organization_id, type=type)
    except ExpiredSignatureError:
        raise expiring_exception
    except JWTError as j2:
        logger.info(f"JWTError: {j2}")
        raise credentials_exception
    return token_data

def encode_token(token_data: TokenData) -> str:
    """ Encode the token data to a JWT token """
    token = jwt.encode(token_data.model_dump(), SECRET_KEY, algorithm=ALGORITHM)
    return token