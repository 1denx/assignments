import urllib.request as req
import json
import csv

chUrl = "https://resources-wehelp-taiwan-b986132eca78c0b5eeb736fc03240c2ff8b7116.gitlab.io/hotels-ch"
enUrl = "https://resources-wehelp-taiwan-b986132eca78c0b5eeb736fc03240c2ff8b7116.gitlab.io/hotels-en"

with req.urlopen(chUrl) as response:
    data_ch = json.load(response)
with req.urlopen(enUrl) as response:
    data_en = json.load(response)

hotel_list_ch = data_ch["list"]
hotel_list_en = data_en["list"]

def hotel_info(hotel_list_ch,hotel_list_en):
    hotels = []  # 存放所有飯店的清單
    for info_ch in hotel_list_ch:
        hotel_id_ch = info_ch["_id"]
        name_ch = info_ch["旅宿名稱"]
        address_ch = info_ch["地址"]
        tel = info_ch["電話或手機號碼"]
        rooms = info_ch["房間數"]

        # 找出英文資料
        for info_en in hotel_list_en:
            if info_en["_id"] == hotel_id_ch:
                name_en = info_en["hotel name"]
                address_en = info_en["address"]
                
                hotel_data = {
                    "旅宿中文名稱": name_ch,
                    "旅宿英文名稱": name_en,
                    "中文地址": address_ch,
                    "英文地址": address_en,
                    "電話": tel,
                    "房間數": rooms
                }
                hotels.append(hotel_data)
                break
    
    with open("hotels.csv", mode="w", encoding="utf-8", newline="") as csvfile:
        field = ["旅宿中文名稱", "旅宿英文名稱", "中文地址", "英文地址", "電話", "房間數"]
        writer = csv.DictWriter(csvfile, fieldnames = field)
        writer.writeheader()
        for hotel in hotels:
            writer.writerow(hotel)

    return hotels

hotel_info(hotel_list_ch, hotel_list_en)



def sum_rooms_by_district(hotel_list_ch):
    districts_rooms = {}
    for hotel in hotel_list_ch:
        address = hotel["地址"]
        rooms = hotel["房間數"]
        # 分離出行政區
        if "臺北市" in address:
            start = address.find("臺北市")+len("臺北市")
            end = address.find("區", start)
            if end != -1:
                district = address[start:end+1]
                districts_rooms[district] = districts_rooms.get(district, 0) + int(rooms)

    with open("districts.csv", mode="w", encoding="utf-8", newline="") as csvfile:
        # 建立 csv 檔寫入
        writer = csv.writer(csvfile)
        writer.writerow(["行政區","房間數"])
        for district, rooms in districts_rooms.items():
            writer.writerow([district,rooms])

    # print(districts_rooms)
    return districts_rooms

sum_rooms_by_district(hotel_list_ch)

