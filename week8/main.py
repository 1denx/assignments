from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]
# origins = ["http://127.0.0.1:5500"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,    # 允許所有跨域來源的請求
    allow_credentials=True,
    allow_methods=["*"],      # 允許哪些 HTTP 方法（GET, POST...）
    allow_headers=["*"],
)

@app.get("/hello")
def hello():
    return {"msg": "Hello from FastAPI CORS"}
