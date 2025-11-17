from fastapi import FastAPI, Form, Request
from fastapi.responses import RedirectResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from fastapi.templating import Jinja2Templates
import urllib.request as req
import json

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key="your_secret_key")
# 設定模板資料夾
templates = Jinja2Templates(directory="templates")

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/login")
async def login(
    request: Request,
    email: str = Form(...),
    password: str = Form(...)
    ):
    if not email or not password:
        msg = "請輸入信箱和密碼"
        return RedirectResponse(url=f"/ohoh?msg={msg}", status_code=303)
    if email == "abc@abc.com" and password == "abc":
        request.session["login"] = True
        return RedirectResponse(url="/member", status_code=303)
    msg="帳號或密碼輸入錯誤"
    return RedirectResponse(url=f"/ohoh?msg={msg}", status_code=303)

@app.get("/logout")
async def logout(request: Request):
    request.session.clear()
    return RedirectResponse(url="/", status_code=303)

@app.get("/member")
async def member(request: Request):
    if not request.session.get("login"):
        return RedirectResponse(url="/")
    return templates.TemplateResponse("member.html", {
        "request": request,
        "message": "恭喜你，成功登入系統"
        })

@app.get("/ohoh")
async def error(request: Request, msg: str ="帳號或密碼輸入錯誤"):
    return templates.TemplateResponse("error.html", {"request": request,"msg": msg})




# 靜態檔案掛載
app.mount("/static", StaticFiles(directory="static"), name="static")
