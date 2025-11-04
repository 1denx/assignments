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

@app.on_event("startup")
async def load_hotels_data():
    fetch_hotel_info()

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

@app.get("/hotel/{id}", response_class=HTMLResponse)
async def get_hotel_info(request: Request, id: int):
    hotels_info = request.app.state.hotels_info
    hotel = hotels_info.get(id)
    if hotel:
        return templates.TemplateResponse("hotel.html", {
        "request": request,
        "hotel": hotel
        })
    return templates.TemplateResponse("hotel.html",{
        "request": request,
        "hotel": None
    })

# 處理旅館資訊
chUrl = "https://resources-wehelp-taiwan-b986132eca78c0b5eeb736fc03240c2ff8b7116.gitlab.io/hotels-ch"
enUrl = "https://resources-wehelp-taiwan-b986132eca78c0b5eeb736fc03240c2ff8b7116.gitlab.io/hotels-en"

def fetch_hotel_info():
    with req.urlopen(chUrl) as response:
        data_ch = json.loads(response.read().decode("utf-8"))
    with req.urlopen(enUrl) as response:
        data_en = json.loads(response.read().decode("utf-8"))

    hotel_list_ch = data_ch["list"]
    hotel_list_en = data_en["list"]

    hotel_en_dist = {info["_id"]: info for info in hotel_list_en}

    hotels = []  # 存放所有飯店的清單
    for info_ch in hotel_list_ch:
        hotel_id = info_ch["_id"]
        name_ch = info_ch["旅宿名稱"]
        tel = info_ch["電話或手機號碼"]

        info_en = hotel_en_dist.get(hotel_id)
        if info_en:
            hotels.append({
                "_id": hotel_id,
                "旅宿中文名稱": name_ch,
                "旅宿英文名稱": info_en["hotel name"],
                "電話": tel
            })

    #print(hotels)
    hotel_info = {hotel["_id"]: hotel for hotel in hotels}
    app.state.hotels_info = hotel_info


# 靜態檔案掛載
app.mount("/static", StaticFiles(directory="static"), name="static")
