from fastapi import FastAPI, Depends
from db import get_db_conn, pool
import time

app = FastAPI()

@app.on_event("startup")
def test_db_connection():
    try:
        conn = pool.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1;")
        cursor.fetchone()
        cursor.close()
        conn.close()
        print("資料庫連線成功！")
    except Exception as e:
        print("無法連線資料庫：", e)

@app.get("/members")
def get_members(conn = Depends(get_db_conn)):
    cursor = conn.cursor(dictionary = True)
    cursor.execute("SELECT id ,name ,email FROM member;")
    data = cursor.fetchall()
    cursor.close()
    return data

@app.get("/api/members/{member_id}")
def get_member(
    member_id: int,
    conn = Depends(get_db_conn)
):
    cursor = conn.cursor(dictionary = True)
    cursor.execute("SELECT id, name, email FROM member WHERE id = %s;",(member_id,))
    data = cursor.fetchone()
    cursor.close()
    return data