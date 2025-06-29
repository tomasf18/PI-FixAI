## External imports
import os
from uuid import uuid4, UUID
from typing import Optional

## Internal imports      
from database import cassandra_client 
from dto.user import UserCreate
from config import AUTH_KEYSPACE as KEYSPACE

# ======================== AUTH KEYSPACE ========================
# a classe for each table in the `auth` keyspace

class User:

    @staticmethod
    async def get_user(email: str) -> Optional[dict]:
        """
        Retrieve the email of a user by user_id.
        """
        query = f"""
        SELECT *
        FROM {KEYSPACE}.users
        WHERE email = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (email,))
        return result
    
    @staticmethod
    async def update_email(old_email: str, new_email: str, password_hash: str, created_at: str, user_id: UUID):
        delete_query = f"""
        DELETE FROM {KEYSPACE}.users
        WHERE email = %s;
        """
        insert_query = f"""
        INSERT INTO {KEYSPACE}.users (email, password_hash, created_at, user_id)
        VALUES (%s, %s, %s, %s)
        """
        
        # Execute the delete query
        await cassandra_client.execute(KEYSPACE, delete_query, (old_email,))
        
        # Execute the insert query
        await cassandra_client.execute(KEYSPACE, insert_query, (new_email, password_hash, created_at, user_id))
    
    @staticmethod
    async def create_user_auth(user: UserCreate) -> UUID:
        """
        Create a user and return the generated user_id.
        """
        user_id = uuid4()
        query = f"""
        INSERT INTO {KEYSPACE}.users (email, password_hash, created_at, user_id)
        VALUES (%s, %s, toTimestamp(now()), %s)
        """
        await cassandra_client.execute(KEYSPACE, query, (user.email, user.password, user_id))
        return user_id

    @staticmethod
    async def delete_user(email: str):
        query = f"""
        DELETE FROM {KEYSPACE}.users
        WHERE email = %s
        """
        await cassandra_client.execute(KEYSPACE, query, (email,))
    
    @staticmethod
    async def update_password(email: str, new_password_hash: str):
        query = f"""
        UPDATE {KEYSPACE}.users
        SET password_hash = %s
        WHERE email = %s
        """
        return await cassandra_client.execute(KEYSPACE, query, (new_password_hash, email))
        

class Operator:
        
    @staticmethod
    async def get_operator(email: str) -> Optional[dict]:
        """
        Retrieve the email of a user by user_id.
        """
        query = f"""
        SELECT *
        FROM {KEYSPACE}.operators
        WHERE email = %s
        """
        return await cassandra_client.execute(KEYSPACE, query, (email,))
         
    


class ConfirmationCodes:
    
    @staticmethod
    async def insert_confirmation_code(email: str, code: str):
        """
        Insert a confirmation code for a user.
        """
        delete_query = f"""
        DELETE FROM {KEYSPACE}.confirmation_codes
        WHERE email = %s
        """
        await cassandra_client.execute(KEYSPACE, delete_query, (email,))
        
        query = f"""
        INSERT INTO {KEYSPACE}.confirmation_codes (email, code)
        VALUES (%s, %s) USING TTL 300
        """
        await cassandra_client.execute(KEYSPACE, query, (email, code))
        
    
    @staticmethod
    async def get_confirmation_code(email: str) -> Optional[dict]:
        """
        Retrieve the email of a user by user_id.
        """
        query = f"""
        SELECT *
        FROM {KEYSPACE}.confirmation_codes
        WHERE email = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (email,))
        return result
    
class RefreshTokens:
    @staticmethod
    async def insert_refresh_token(refresh_token: str):
        """
        Insert a refresh token.
        """
        query = f"""
        INSERT INTO {KEYSPACE}.refresh_tokens (refresh_token)
        VALUES (%s) USING TTL {150 * 24 * 60 * 60}
        """
        await cassandra_client.execute(KEYSPACE, query, (refresh_token,))
        
    @staticmethod
    async def get_refresh_token(refresh_token: str) -> Optional[dict]:
        """
        Retrieve a refresh token.
        """
        query = f"""
        SELECT *
        FROM {KEYSPACE}.refresh_tokens
        WHERE refresh_token = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (refresh_token,))
        return result
    