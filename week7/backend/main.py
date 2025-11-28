import os
import mysql.connector
from dotenv import load_dotenv, find_dotenv
from fastapi import FastAPI, Form, Depends, Body, Request, Query
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
    body: dict = Body(...),
    db = Depends(get_db)
):
    con, cursor = db
    name = body.get("name")
    email = body.get("email")
    password = body.get("password")

    if not name or not email or not password:
        return {"error": True}
    
    query = "SELECT * FROM member WHERE email = %s"
    cursor.execute(query, (email,))
    exists = cursor.fetchone()

    if exists:
        return {"error": True, "msg": "重複的電子郵件"}

    try:
        insert_query = "INSERT INTO member (name, email, password) VALUES (%s, %s, %s)"
        cursor.execute(insert_query, (name, email, password))
        con.commit()
        return {"ok": True}
    except:
        return {"error": True}

    

@app.post("/api/login")
def login(
    body: dict = Body(...),
    db = Depends(get_db)
):
    con, cursor = db
    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return {"error": True}

    query = "SELECT id, name, password FROM member WHERE email = %s"
    cursor.execute(query, (email,))
    user = cursor.fetchone()

    if not user:
        return {"data": None}

    if user["password"] != password:
        return {"error": True}
    
    return {
        "data": {
            "id": user["id"],
            "name": user["name"]
        }
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
        return {"data": None}

    if searcher_id and str(searcher_id) != str(member_id):
        insert_query = """
            INSERT INTO query_log (target_id, searcher_id)
            VALUES (%s, %s)
        """
        cursor.execute(insert_query, (member_id, searcher_id))
        con.commit()
    
    return {"data": user}

@app.patch("/api/member")
def update_username(
    request: Request,
    member_id: int = Query(...),
    body: dict = Body(...),
    db = Depends(get_db)
):
    con, cursor = db

    login_user = request.query_params.get("from")
    if not login_user or int(login_user) != member_id:
        return {"error": True}

    new_name = body.get("name")
    if not new_name:
        return {"error": True}

    try:
        query = "UPDATE member SET name = %s WHERE id = %s;"
        cursor.execute(query,(new_name, member_id))
        con.commit()

        if cursor.rowcount == 0:
            return {"error": True}
    
        return {"ok": True}
    
    except:
        return {"error": True}

@app.get("/api/member/{member_id}/query_log")
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
    records = cursor.fetchall()

    return {"data": records}
