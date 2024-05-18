# main.py

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
import psycopg2
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with the list of allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Database Connection
conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT")
)

# Token Settings
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300000

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 Password Bearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class User(BaseModel):
    username: str
    email: str


class UserInDB(User):
    hashed_password: str
    # password: str 


class Token(BaseModel):
    access_token: str
    token_type: str


class Watchlist(BaseModel):
    symbol: str


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_user(username: str):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
   
    if user:
        return UserInDB(username=user[1], email=user[2], hashed_password=user[3])


def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    print(form_data.username, form_data.password)
    user = authenticate_user(form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/register", response_model=User)
async def register_user(user: UserInDB):
    hashed_password = pwd_context.hash(user.hashed_password)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (username, email, hashed_password) VALUES (%s, %s, %s)",
        (user.username, user.email, hashed_password)
    )
    conn.commit()
    cursor.close()
    return user


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        return get_user(username)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


@app.post("/watchlist/", response_model=Watchlist)
async def add_symbol_to_watchlist(symbol: Watchlist, current_user: UserInDB = Depends(get_current_user)):
    cursor = conn.cursor()
    cursor.execute("INSERT INTO watchlist (username, symbol) VALUES (%s, %s)", (current_user.username, symbol.symbol))
    conn.commit()
    cursor.close()
    return {"symbol": symbol.symbol}


@app.get("/watchlist/", response_model=List[Watchlist])
async def get_watchlist(current_user: UserInDB = Depends(get_current_user)):
    cursor = conn.cursor()
    print(current_user.username)
    cursor.execute("SELECT symbol FROM watchlist WHERE username = %s", (current_user.username,))
    symbols = [Watchlist(symbol=row[0]) for row in cursor.fetchall()]
    cursor.close()
    return symbols
