from fastapi import FastAPI
import mysql.connector
from db import get_db_conn, pool
import time
import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
SECRET_KEY = os.getenv("SECRET_KEY")

app = FastAPI()

# 不使用連接池
def run_without_pool():
    for i in range(10):
        print(f"建立連線 {i+1}...")
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        cursor = conn.cursor()
        cursor.execute("SELECT SLEEP(1);") # 模擬耗時
        cursor.fetchone()
        cursor.close()
        conn.close()
        print(f"關閉連線 {i+1}")

# 使用連接池
def run_with_pool():
    for i in range(10):
        conn = pool.get_connection()
        print(f"連接池 Connection ID: {conn.connection_id}")

        cursor = conn.cursor()
        cursor.execute("SELECT SLEEP(1);")
        cursor.fetchone()
        cursor.close()
        conn.close()
        print(f"連接池歸還連線 {i+1}")

@app.on_event("startup")
def run_pool_test():
    print("測試 無連接池")
    run_without_pool()

    print("測試 有連接池")
    run_with_pool()