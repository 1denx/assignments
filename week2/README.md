## TASK 1
### 直線方程式
- 兩點式公式為：```(y - y1)(x2 - x1) = (x - x1)(y2 - y1)```
### 判斷兩點是否在同一側
- 將 2 點代入直線方程式
- 看結果的正負號
- 如果兩點的結果同號（都是正或都是負）→ 同側
- 如果兩點的結果異號（一正一負）→ 異側
### 曼哈頓距離
- 兩點 ```P1（x1, y1）``` 和 ```P2（x2, y2）```，其曼哈頓距離的公式為：```d(x, y) = | x1- x2 | + | y1 - y2 |```
## TASK 2
- 初始設定預約列表為空
- 分離條件的欄位與值
- 找符合條件的服務
- 檢查某服務在時段是否可用
- 篩選可用服務
- 找出最符合條件的並預約
## TASK 3
- 數列規律：```-2, -3, +1, +2```
- 每四個數字一組
- 每組起始數字 ```=``` 上一組起始數字 ```-2```
### JavaScript
**方法一**
```
function func3(index) {
  const group = Math.floor(index / 4);
  const position = index % 4;
  const groupStart = 25 - group * 2;
  const changes = [0, -2, -5, -4];
  const result = groupStart + changes[position];
  console.log(result);
  return result;
}
```
**方法二**：使用 ```for``` 迴圈
```
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
```
## TASK 4
- 判斷該車廂可否進入：```stat[i] === "0"```
- 判斷車廂座位與人數差距：```Math.abs(sp[i] - n)```
- 判斷剩餘座位與進入人數差距最小的是最適合的車廂