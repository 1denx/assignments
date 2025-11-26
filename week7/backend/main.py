import os
import mysql.connector
from dotenv import load_dotenv, find_dotenv
from fastapi import FastAPI, Form, Depends, Body, Request
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
        "member_id": user["id"],
        "name": user["name"]
    }

@app.get("/api/member/{member_id}")
def get_member_info(
    request: Request,
    member_id: int,
    db = Depends(get_db)
):
    con, cursor = db
    searcher_id = request.query_params.get("from")

    query = "SELECT id, name, email FROM member WHERE id = %s;"
    cursor.execute(query, (member_id,))
    user = cursor.fetchone()

    if not user:
        return {"success": False, "msg": "無資料"}

    if searcher_id and int(searcher_id) != member_id:
        insert_query = """
            INSERT INTO query_log (target_id, searcher_id)
            VALUES (%s, %s)
        """
        cursor.execute(insert_query, (member_id, searcher_id))
        con.commit()
    
    return {
        "success": True,
        "data":{
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    }

@app.patch("/api/member/{member_id}")
def update_username(
    member_id: int,
    body: dict = Body(...),
    db = Depends(get_db)
):
    con, cursor = db
    new_name = body.get("name")

    if not new_name:
        return {"success": False, "msg": "名稱不可為空"}

    query = "UPDATE member SET name = %s WHERE id = %s;"
    cursor.execute(query,(new_name, member_id))
    con.commit()

    if cursor.rowcount == 0:
        return {"success": False, "msg": "更新失敗"}
    
    return {"success": True, "msg": "更新成功"}

@app.get("/api/query_log/{member_id}")
def get_query_log(
    member_id: int,
    db = Depends(get_db)
):
    con, cursor = db
    query = """
        SELECT
            query_log.searcher_id,
            member.name AS searcher_name,
            query_log.created_at
        FROM query_log
        INNER JOIN member ON query_log.searcher_id = member.id
        WHERE query_log.target_id = %s
        ORDER BY query_log.created_at DESC
        LIMIT 10;
    """
    cursor.execute(query,(member_id,))
    rows = cursor.fetchall()

    records = []
    for row in rows:
        records.append({
            "searcher_id": row["searcher_id"],
            "searcher_name": row["searcher_name"],
            "create_time": row["created_at"].strftime("%Y-%m-%d %H:%M:%S")
        })

    return {
        "success": True,
        "data": records
    }
