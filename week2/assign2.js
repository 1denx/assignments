console.log("========== TASK 1 ==========");
const roles = {
  "貝吉塔": [-4, -1],
  "辛巴": [-3, 3],
  "丁滿": [-1, 4],
  "悟空": [0, 0],
  "特南克斯": [1, -2],
  "弗利沙": [4, -1],
};
// 線穿過的兩點(近似值)
const point1 = [2, -1];
const point2 = [-1, 3];

// 計算直線方程式
function getLineEquation(p1, p2) {
  const [x1, y1] = p1;
  const [x2, y2] = p2;

  const A = y2 - y1;
  const B = x1 - x2;
  const C = y1 * (x2 - x1) - x1 * (y2 - y1);

  return { A, B, C };
}

// 計算點到線的代入值（判斷在哪一側）
function getSide(point, lineEq) {
  const [x, y] = point;
  const { A, B, C } = lineEq;
  return A * x + B * y + C;
}

// 判斷兩點是否在線的同側
function isSameSide(side1, side2) {
  // 同號則在同側
  return side1 * side2 > 0;
}

// 計算距離
function getDist(point1, point2) {
  return Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1]);
}
// 計算移動到另一側，則額外 +2 個距離單位
function getTotalDist(point1, point2, lineEq) {
  const dist = getDist(point1, point2);

  const side1 = getSide(point1, lineEq);
  const side2 = getSide(point2, lineEq);

  // 異側則 +2 個距離單位
  const crossLine = isSameSide(side1, side2) ? 0 : 2;
  return dist + crossLine;
}

function func1(name) {
  // 檢查角色是否存在
  if (!roles[name]) {
    console.log(`角色 ${name} 不存在`);
    return;
  }

  const lineEq = getLineEquation(point1, point2);
  const targetPoint = roles[name];

  // 計算其他角色到指定角色的距離
  const distance = [];
  for (const [roleName, rolePoint] of Object.entries(roles)) {
    if (roleName === name) continue;

    const totalDist = getTotalDist(targetPoint, rolePoint, lineEq);

    distance.push({
      name: roleName,
      distance: totalDist,
      point: rolePoint,
    });
  }
  // 排序
  distance.sort((a, b) => a.distance - b.distance);

  // 找出最近與最遠
  const minDist = distance[0].distance;
  const maxDist = distance[distance.length - 1].distance;
  const nearest = distance
    .filter((d) => d.distance === minDist)
    .map((d) => d.name);
  const farthest = distance
    .filter((d) => d.distance === maxDist)
    .map((d) => d.name);

  console.log(`最遠${farthest.join("、")}；最近${nearest.join("、")}`);
}
func1("辛巴"); // print 最遠弗利沙；最近丁滿、貝吉塔
func1("悟空"); // print 最遠丁滿、弗利沙；最近特南克斯
func1("弗利沙"); // print 最遠辛巴，最近特南克斯
func1("特南克斯"); // print 最遠丁滿，最近悟空

console.log("========== TASK 2 ==========");
const services = [
  { name: "S1", r: 4.5, c: 1000 },
  { name: "S2", r: 3, c: 1200 },
  { name: "S3", r: 3.8, c: 800 },
];
// 儲存預約記錄
let svcBookings = {};

function func2(ss, start, end, criteria) {
  // 初始設定預約列表為空
  if (Object.keys(svcBookings).length === 0) {
    for (const svc of ss) {
      svcBookings[svc.name] = [];
    }
  }
  // console.log(svcBookings);

  // 分離參數 criteria 的欄位與值
  let field, op, val;
  if (criteria.includes(">=")) {
    [field, val] = criteria.split(">=", 2);
    op = ">=";
  } else if (criteria.includes("<=")) {
    [field, val] = criteria.split("<=", 2);
    op = "<=";
  } else if (criteria.includes("=")) {
    [field, val] = criteria.split("=", 2);
    op = "=";
  } else return;

  // 把值轉換成數字
  const numVal = parseFloat(val);
  if (!isNaN(numVal)) {
    val = numVal;
  }

  // 找符合條件的服務
  const matchSvc = ss.filter((svc) => {
    if (field === "name") {
      return op === "=" && svc.name === val;
    } else {
      if (!(field in svc) || typeof svc[field] !== "number") {
        return false;
      }
      const svcVal = svc[field];
      if (op === ">=") {
        return svcVal >= val;
      } else if (op === "<=") {
        return svcVal <= val;
      } else return false;
    }
  });

  // 檢查某服務在時段是否可用
  function isAvailable(svc, startTime, endTime) {
    const bookings = svcBookings[svc.name] || [];
    for (let booking of bookings) {
      let bookedStart = booking[0];
      let bookedEnd = booking[1];
      if (startTime < bookedEnd && endTime > bookedStart) {
        return;
      }
    }
    return true;
  }

  // 篩選可用服務
  const candidates = [];
  for (let svc of matchSvc) {
    if (!isAvailable(svc, start, end)) continue;
    candidates.push(svc);
  }
  if (candidates.length === 0) {
    console.log("Sorry");
    return "Sorry";
  }

  // 找出最符合條件的並預約
  let chosen = null;
  if (op === "=") {
    chosen = candidates[0];
  } else if (op === ">=") {
    let bestVal = Infinity;
    for (let c of candidates) {
      const filedVal = parseFloat(c[field]);
      if (filedVal < bestVal) {
        bestVal = filedVal;
        chosen = c;
      }
    }
  } else {
    let bestVal = -Infinity;
    for (let c of candidates) {
      const filedVal = parseFloat(c[field]);
      if (filedVal > bestVal) {
        bestVal = filedVal;
        chosen = c;
      }
    }
  }
  svcBookings[chosen.name].push([start, end]);
  console.log(chosen.name);
}
func2(services, 15, 17, "c>=800"); // S3
func2(services, 11, 13, "r<=4"); // S3
func2(services, 10, 12, "name=S3"); // Sorry
func2(services, 15, 18, "r>=4.5"); // S1
func2(services, 16, 18, "r>=4"); // Sorry
func2(services, 13, 17, "name=S1"); // Sorry
func2(services, 8, 9, "c<=1500"); // S2
func2(services, 8, 9, "c<=1500"); // S1

console.log("========== TASK 3 ==========");
function func3(index) {
  let val = 25;
  const changes = [-2, -3, 1, 2];

  for (let i = 0; i < index; i++) {
    // i % 4 決定要從 changes 清單中選哪一個
    val += changes[i % 4];
  }
  console.log(val);
  return val;
}
func3(1); // print 23
func3(5); // print 21
func3(10); // print 16
func3(30); // print 6

console.log("========== TASK 4 ==========");
function func4(sp, stat, n) {
  // sp = 可用座位
  // stat = 車廂狀態
  // n = 乘客人數

  let minDiff = Infinity; // 最小可用座位，初始化最小差異為無限大
  let bestIndex = -1; // 最佳車廂(目前沒有)

  for (let i = 0; i < sp.length; i++) {
    // 判斷車廂能否進入
    if (stat[i] === "0") {
      // 判斷剩餘座位與人數差距
      const extraSeats = Math.abs(sp[i] - n);
      if (extraSeats < minDiff) {
        minDiff = extraSeats;
        bestIndex = i;
      }
    }
  }
  console.log(bestIndex);
  return bestIndex;
}
func4([3, 1, 5, 4, 3, 2], "101000", 2); // print 5
func4([1, 0, 5, 1, 3], "10100", 4); // print 4
func4([4, 6, 5, 8], "1000", 4); // print 2
