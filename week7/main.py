import os
import json
import urllib.request as req
import mysql.connector
from dotenv import load_dotenv, find_dotenv
from fastapi import FastAPI, Form, Request, Depends, Body
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
SECRET_KEY = os.getenv("SECRET_KEY")

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)
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

def get_user_info(con, cursor):
    query = """
    SELECT 
        message.id AS message_id, 
        member.id AS member_id,
        member.name AS name,
        message.content AS content
    FROM message
    INNER JOIN member 
        ON message.member_id = member.id
    ORDER BY message.id ASC;
    """
    cursor.execute(query)
    return cursor.fetchall()

@app.get("/")
async def home(request: Request):
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

    query = "SELECT id, name, password FROM member WHERE email =%s;"
    cursor.execute(query,(email,))
    user = cursor.fetchone()
    
    if user is None:
        return RedirectResponse(url="/ohoh?msg=電子郵件或密碼錯誤", status_code=303)
    else:
        if user["password"] == password:
            request.session["user_id"] = user["id"]
            request.session["name"] = user["name"]
            return RedirectResponse(url="/member", status_code=303)
        else:
            return RedirectResponse(url="ohoh?msg=電子郵件或密碼錯誤", status_code=303)

@app.get("/logout")
async def logout(request: Request):
    request.session.clear()
    return RedirectResponse(url="/", status_code=303)

@app.get("/member")
async def member(request: Request, db = Depends(get_db_connector)):
    con, cursor = db
    user_id = request.session.get("user_id")
    if not user_id:
        return RedirectResponse(url="/ohoh?msg=請先登入", status_code=303)
    
    messages = get_user_info(con, cursor)

    return templates.TemplateResponse("member.html", {
        "request": request,
        "username": request.session.get("name"),
        "messages": messages
        })

@app.get("/ohoh")
async def error(request: Request, msg: str ="帳號或密碼輸入錯誤"):
    return templates.TemplateResponse("error.html", {"request": request,"msg": msg})

@app.get("/api/member/{member_id}")
def get_member_info(
    request:Request,
    member_id: int,
    db = Depends(get_db_connector)
):
    con, cursor = db
    user_id = request.session.get("user_id")
    if not user_id:
        return {"data": None}
    
    query = "SELECT id, name, email FROM member WHERE id = %s;"
    cursor.execute(query,(member_id,))
    member = cursor.fetchone()

    if not member:
        return {"data": None}

    # 記錄到 query_log
    if user_id != member_id:
        insert_query = """
            INSERT INTO query_log (target_id, searcher_id)
            VALUES (%s, %s)
        """
        cursor.execute(insert_query, (member_id, user_id))
        con.commit()
    
    return {"data": member}

@app.patch("/api/member")
def update_username(
    request:Request,
    body: dict = Body(...),
    db = Depends(get_db_connector)
):
    con, cursor = db

    user_id = request.session.get("user_id")
    if not user_id:
        return {"error": True, "msg": "請先登入"}

    new_name = body.get("name", "").strip()
    if not new_name:
        return {"error": True, "msg": "名稱不得為空"}

    update_query = "UPDATE member SET name = %s WHERE id = %s;"
    cursor.execute(update_query, (new_name, user_id))
    con.commit()

    request.session["name"] = new_name
    return {"ok": True}

@app.get("/api/query_log")
def get_query_log(
    request:Request,
    db = Depends(get_db_connector)
):
    con, cursor = db

    user_id = request.session.get("user_id")
    if not user_id:
        return {"error": True, "msg": "無權限查詢其他會員資料"}
    
    query = """
        SELECT
            query_log.searcher_id,
            member.name AS searcher_name,
            query_log.created_at
        FROM query_log
        INNER JOIN member ON query_log.searcher_id = member.id
        WHERE query_log.target_id = %s
            AND query_log.searcher_id <> %s
        ORDER BY query_log.created_at DESC
        LIMIT 10;
    """
    cursor.execute(query, (user_id, user_id))
    records = cursor.fetchall()

    return {"data": records}


# 靜態檔案掛載
app.mount("/static", StaticFiles(directory="static"), name="static")
