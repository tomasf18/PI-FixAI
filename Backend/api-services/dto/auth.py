## External imports
from uuid import UUID
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from dto.user import UserCreate

# ======================== AUTH DTO ========================

class Tokens(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    
class TokenData(BaseModel):
    user_id: UUID | str
    email: str
    organization_id: Optional[UUID] | str
    type: str # "access" or "refresh"
    
class Token(BaseModel):
    access_token: str

class Auth(BaseModel):
    email: str
    password_hash: str
    created_at: datetime
    
class UserAuth(Auth):
    user_id: UUID

class OperatorAuth(Auth):
    organization_id: UUID
    operator_id: UUID
    
class CurrentUser(BaseModel):
    current_user: Auth
    token: dict
    
class EmailRequest(BaseModel):
    email: str
    
class ConfirmCodeRequest(BaseModel):
    code: str
    name: str
    email: str
    password: str
    
class NewPasswordRequest(BaseModel):
    code: str
    email: str
    new_password: str