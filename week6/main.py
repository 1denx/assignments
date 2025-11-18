import os
import json
import urllib.request as req
import mysql.connector
from dotenv import load_dotenv, find_dotenv
from fastapi import FastAPI, Form, Request, Depends
from typing import Annotated 
from fastapi.responses import RedirectResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from fastapi.templating import Jinja2Templates

# 載入 .env 變數
load_dotenv(find_dotenv())

DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key="your_secret_key")
templates = Jinja2Templates(directory="templates")

def get_db_connector():
    con = None
    cursor = None
    try:
        con = mysql.connector.connect(
            host = DB_HOST,
            user = DB_USER,
            password = DB_PASSWORD,
            database = DB_NAME
        )
        cursor = con.cursor(dictionary=True)
        print("資料庫連線成功")
        yield con, cursor
    except Exception as e:
        print(f"資料庫連線錯誤: {e}")
        raise e
    finally:
        if cursor:
            cursor.close()
        if con:
            con.close()

@app.get("/")
async def home(request: Request):
    if request.session.get("SIGNIN"):
        return RedirectResponse(url="/member", status_code=303)
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/signup")
async def signup(
    request: Request,
    name: Annotated[str, Form()],
    email: Annotated[str, Form()],
    password: Annotated[str, Form()],
    db = Depends(get_db_connector)
):
    con, cursor = db
    query = "SELECT * FROM member WHERE email = %s;"
    cursor.execute(query, (email,))
    user = cursor.fetchone()

    if user:
        return RedirectResponse(url="/ohoh?msg=重複的電子郵件", status_code=303)

    insert_query = "INSERT INTO member (name, email, password) VALUES (%s, %s, %s)"
    cursor.execute(insert_query,(name, email, password))

    con.commit()
    return RedirectResponse(url="/", status_code=303)
    

@app.post("/login")
async def login(
    request: Request,
    email: Annotated[str, Form()],
    password: Annotated[str, Form()],
    db = Depends(get_db_connector)
):
    con, cursor = db

    email = email.strip()
    password = password.strip()
    if not email or not password:
        return RedirectResponse(url="/ohoh?msg=請輸入信箱或密碼", status_code=303)

    query = "SELECT id, password FROM member WHERE email =%s;"
    cursor.execute(query,(email,))
    user = cursor.fetchone()
    
    if user is None:
        return RedirectResponse(url="/ohoh?msg=電子郵件或密碼錯誤", status_code=303)
    else:
        if user["password"] == password:
            request.session["user_id"] = user["id"]
            return RedirectResponse(url="/member", status_code=303)
        else:
            return RedirectResponse(url="ohoh?msg=電子郵件或密碼錯誤", status_code=303)

@app.get("/logout")
async def logout(request: Request):
    request.session.clear()
    return RedirectResponse(url="/", status_code=303)

@app.get("/member")
async def member(request: Request, db = Depends(get_db_connector)):
    user_id = request.session.get("user_id")
    if not user_id:
        return RedirectResponse(url="/ohoh?msg=請先登入", status_code=303)
    return templates.TemplateResponse("member.html", {
        "request": request,
        "message": "恭喜你，成功登入系統"
        })

@app.get("/ohoh")
async def error(request: Request, msg: str ="帳號或密碼輸入錯誤"):
    return templates.TemplateResponse("error.html", {"request": request,"msg": msg})




# 靜態檔案掛載
app.mount("/static", StaticFiles(directory="static"), name="static")
