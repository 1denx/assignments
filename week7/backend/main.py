import os
import mysql.connector
from dotenv import load_dotenv, find_dotenv
from fastapi import FastAPI, Form, Depends, Body
from fastapi.middleware.cors import CORSMiddleware

# 載入 .env 變數
load_dotenv(find_dotenv())

SECRET_KEY = os.getenv("SECRET_KEY")
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

# 連線 DB
def get_db():
    con = mysql.connector.connect(
        host = DB_HOST,
        user = DB_USER,
        password = DB_PASSWORD,
        database = DB_NAME
    )
    cursor = con.cursor(dictionary=True)
    try:
        yield con, cursor
    finally:
        cursor.close()
        con.close()

@app.post("/api/signup")
def signup(
    name: str = Form(),
    email: str = Form(),
    password: str = Form(),
    db = Depends(get_db)
):
    con, cursor = db

    query = "SELECT * FROM member WHERE email = %s"
    cursor.execute(query, (email,))
    user = cursor.fetchone()

    if user:
        return {"success": False, "msg": "重複的電子郵件"}

    insert_query = "INSERT INTO member (name, email, password) VALUES (%s, %s, %s)"
    cursor.execute(insert_query, (name, email, password))
    con.commit()
    return {"success": True}

@app.post("/api/login")
def login(
    email: str = Form(),
    password: str = Form(),
    db = Depends(get_db)
):
    con, cursor = db

    query = "SELECT id, name, password FROM member WHERE email = %s"
    cursor.execute(query, (email,))
    user = cursor.fetchone()

    if not user or user["password"] != password:
        return {"success": False, "msg": "帳號或密碼錯誤"}
    
    return {
        "success": True,
        "user_id": user["id"],
        "name": user["name"]
    }

@app.get("/api/member/{member_id}")
def get_member_info(
    member_id: int,
    db = Depends(get_db)
):
    con, cursor = db

    query = "SELECT id, name, email FROM member WHERE id = %s;"
    cursor.execute(query, (member_id,))
    user = cursor.fetchone()

    if not user:
        return {"success": False, "msg": "無資料"}
    
    return {
        "success": True,
        "data":{
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    }
