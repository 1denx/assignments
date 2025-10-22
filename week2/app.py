print("===== TASK 1 =====")
roles = {
    "貝吉塔": [-4, -1],
    "辛巴": [-3, 3],
    "丁滿": [-1, 4],
    "悟空": [0, 0],
    "特南克斯": [1, -2],
    "弗利沙": [4, -1],
    }
    
point1 = [2, -1]
point2 = [-1, 3]

# 計算直線方程式
def getLineEquation(p1, p2):
    [x1, y1] = p1
    [x2, y2] = p2

    A = y2 - y1
    B = x1 - x2
    C = y1 * (x2 - x1) - x1 * (y2 - y1)
    return {"A": A, "B": B, "C": C}

# 計算點到線的代入值（判斷在哪一側）
def getSide(point, lineEq):
    [x, y] = point
    A = lineEq["A"]
    B = lineEq["B"]
    C = lineEq["C"]
    return A * x + B * y + C

# 判斷兩點是否在線的同側
def isSameSide(side1, side2):
    return side1 * side2 > 0

# 計算距離
def getDist(point1, point2):
    return abs(point1[0] - point2[0]) + abs(point1[1] - point2[1])

# 計算移動到另一側，則額外 +2 個距離單位
def getTotalDist(point1, point2, lineEq):
    dist = getDist(point1, point2)
    side1 = getSide(point1, lineEq)
    side2 = getSide(point2, lineEq)

    # 異側則 +2 個距離單位
    crossLine = 0 if isSameSide(side1, side2) else 2
    return dist + crossLine

def func1(name):
    # 檢查角色是否存在
    if name not in roles:
        print(f"角色 {name} 不存在")
        return
    
    lineEq = getLineEquation(point1, point2)
    targetPoint = roles[name]

    # 計算其他角色到指定角色的距離
    distance = []
    for [roleName, rolePoint] in roles.items():
        if roleName == name:
            continue
    
        totalDist = getTotalDist(targetPoint, rolePoint, lineEq)

        distance.append({
            "name": roleName,
            "distance": totalDist,
            "point": rolePoint
        })
    # 排序
    distance.sort(key=lambda x: x["distance"])

    # 找出最近與最遠
    minDist = distance[0]["distance"]
    maxDist = distance[-1]["distance"]
    nearest = [d["name"] for d in distance if d["distance"] == minDist]
    farthest = [d["name"] for d in distance if d["distance"] == maxDist]

    print(f"最遠{'、'.join(farthest)}；最近{'、'.join(nearest)}")

func1("辛巴")    # print 最遠弗利沙；最近丁滿、貝吉塔
func1("悟空")    # print 最遠丁滿、弗利沙；最近特南克斯
func1("弗利沙")   # print 最遠辛巴，最近特南克斯
func1("特南克斯") # print 最遠丁滿，最近悟空

print("===== TASK 2 =====")
# 儲存預約記錄
svcBookings = {}
def func2(ss, start, end, criteria):
    # 初始設定預約列表為空
    if not svcBookings:
        for svc in ss:
            svcBookings[svc["name"]] = []
            
    # 分離參數 criteria 的欄位與值
    if ">=" in criteria:
        field, val = criteria.split(">=",1)
        op = ">="
    elif "<=" in criteria:
        field, val = criteria.split("<=",1)
        op = "<="
    elif "=" in criteria:
        field, val = criteria.split("=",1)
        op = "="
    else:
        return None

    # 把值轉換成數字
    if field != "name":
        val = float(val)
    # print(f"field:{field} op:{op} val:{val}")

    # 檢查某服務在時段是否可用
    def isAvailable(svc, startTime, endTime):
        bookings = svcBookings.get(svc["name"],[])
        for booking in bookings:
            bookedStart, bookedEnd = booking
            if startTime < bookedEnd and endTime > bookedStart:
                return False
        return True

    # 篩選可用服務
    candidates = []
    for svc in ss:
        if not isAvailable(svc, start, end):
            continue
        svcVal = svc[field] if field != "name" else svc["name"]
        if op == "=" and str(svcVal) == val:
            candidates.append(svc)
        elif op == ">=" and field != "name" and svcVal >= val:
            candidates.append(svc)
        elif op == "<=" and field != "name" and svcVal >= val:
            candidates.append(svc)

    if len(candidates) == 0:
        print("Sorry")
        return "Sorry"

    # 找出最符合條件的並預約
    chosen = None
    if op == "=":
        chosen = candidates[0]
    elif op == ">=":
        bestVal = float('inf')
        for c in candidates:
            fieldVal = float(c[field])
        if fieldVal < bestVal:
            bestVal = fieldVal
            chosen = c
    else:
        bestVal = -float('inf')
        for c in candidates:
            fieldVal = float(c[field])
            if fieldVal < bestVal:
                bestVal = fieldVal
                chosen = c
    if chosen is None:
        print("Sorry")
        return "Sorry"

    svcBookings[chosen["name"]].append([start,end])
    print(chosen["name"])
    return chosen["name"]

services=[
    {"name":"S1", "r":4.5, "c":1000},
    {"name":"S2", "r":3, "c":1200},
    {"name":"S3", "r":3.8, "c":800}
]
func2(services, 15, 17, "c>=800")  # S3
func2(services, 11, 13, "r<=4")    # S3
func2(services, 10, 12, "name=S3") # Sorry
func2(services, 15, 18, "r>=4.5")  # S1
func2(services, 16, 18, "r>=4")    # Sorry
func2(services, 13, 17, "name=S1") # Sorry
func2(services, 8, 9, "c<=1500")   # S2
print("===== TASK 3 =====")

print("===== TASK 4 =====")
