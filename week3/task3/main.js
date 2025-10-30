const mobileMenuBtn = document.querySelector(".mobile_menu");
const navMenu = document.querySelector(".nav_menu");
const closeBtn = document.querySelector(".btn");

// 漢堡選單
mobileMenuBtn.addEventListener("click", () => {
  navMenu.classList.add("open");
});

closeBtn.addEventListener("click", () => {
  navMenu.classList.remove("open");
});

document.addEventListener("click", (e) => {
  if (
    navMenu.classList.contains("open") &&
    !navMenu.contains(e.target) &&
    !mobileMenuBtn.contains("e.target")
  ) {
    navMenu.classList.remove("open");
  }
});

// 存放 API 資料
let spots = [];
let pics = [];
let currentIndex = 13; // 前 3+10 筆資料
const infoUrl = "https://cwpeng.github.io/test/assignment-3-1";
const imgUrl = "https://cwpeng.github.io/test/assignment-3-2";
const picHostURL = "https://www.travel.taipei";

// Dom 完全加載後執行
document.addEventListener("DOMContentLoaded", async function () {
  await initPage();
});

// 頁面初始化
async function initPage() {
  // 加載資料
  try {
    const spotsRes = await fetch(infoUrl);
    if (!spotsRes.ok) {
      throw new Error("Could not fetch resource");
    }
    const spotsData = await spotsRes.json();
    // console.log("spotsAPI", spotsData);
    spots = spotsData.rows;
    console.log(spots);

    const picsRes = await fetch(imgUrl);
    if (!picsRes.ok) {
      throw new Error("Could not fetch resource");
    }
    const picsData = await picsRes.json();
    // console.log("picsAPI", picsData);
    pics = picsData.rows;
    console.log(pics);

    renderPage(pics, spots);
    loadMore();
    return [spots, pics];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// 建立 picMap 工具
function createPicMap(pics) {
  return new Map(pics.map((p) => [p.serial, p]));
}

// 渲染畫面
function renderPage(pics, spots) {
  const promotion = document.querySelectorAll(".promotion");
  const picMap = createPicMap(pics);

  // 渲染前 3 筆
  const firstThreeSpots = spots.slice(0, 3);
  firstThreeSpots.forEach((spot, i) => {
    const el = promotion[i];
    if (!el) {
      return;
    }
    // 找出景點對應的圖片資料
    const pic = picMap.get(spot.serial);
    if (!pic) {
      return;
    }

    const firstImg = pic.pics?.split(".jpg").at(0) + ".jpg";
    const img = el.querySelector("img");
    if (!img) {
      img = document.createElement("img");
      el.appendChild(img);
    }
    const p = el.querySelector("p");
    if (!p) {
      p = document.createElement("p");
      el.appendChild(p);
    }
    img.src = picHostURL + firstImg;
    img.alt = spot.sname;
    p.textContent = spot.sname;
  });

  // 渲染後 10 筆
  let gridBox = document.querySelector(".grid-box");
  if (!gridBox) {
    gridBox = document.createElement("div");
    gridBox.classList.add("grid-box");
    const promotionBox = document.querySelector(".promotion-box");
    promotionBox?.after(gridBox);
  }
  const nextSpots = spots.slice(3, 13);
  // 檢查現有 .grid-item 數量，若不足就補齊（並給 title1..title10）
  const existingItems = gridBox.querySelectorAll(".grid-item");
  if (existingItems.length < nextSpots.length) {
    const need = nextSpots.length - existingItems.length;
    for (let i = 0; i < need; i++) {
      const idx = existingItems.length + i;
      const titleClass = `title${(idx % 10) + 1}`;
      const placeholder = document.createElement("div");
      placeholder.classList.add("relative", "grid-item", titleClass);
      gridBox.appendChild(placeholder);
    }
  }
  // 取得或新增後的 grid-item nodeList，並填入內容
  const gridItemEls = gridBox.querySelectorAll(".grid-item");
  nextSpots.forEach((spot, i) => {
    const el = gridItemEls[i];
    const pic = picMap.get(spot.serial);
    if (!el || !pic) {
      return;
    }
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }

    const firstImg = pic.pics?.split(".jpg").at(0) + ".jpg";
    const img = document.createElement("img");
    img.src = picHostURL + firstImg;
    img.alt = spot.sname;

    const star = document.createElement("span");
    star.classList.add(
      "material-symbols-outlined",
      "absolute-star",
      "star-icon"
    );
    star.textContent = "kid_star";

    const absBox = document.createElement("div");
    absBox.classList.add("absolute-box", "bg-opacity", "w-full");
    const title = document.createElement("p");
    title.textContent = spot.sname;
    absBox.appendChild(title);

    el.append(img, star, absBox);
  });

  currentIndex = 3 + nextSpots.length;
}

// 顯示更多
function loadMore() {
  const moreBtn = document.querySelector(".more_btn");
  const gridContainer = document.querySelector(".grid-container");
  const picMap = createPicMap(pics);

  moreBtn.addEventListener("click", () => {
    const nextBatch = spots.slice(currentIndex, currentIndex + 10);
    if (nextBatch.length === 0) {
      moreBtn.textContent = "資料已到底";
      moreBtn.disabled = true;
      return;
    }

    const newGridBox = document.createElement("div");
    newGridBox.classList.add("grid-box");

    nextBatch.forEach((spot, i) => {
      const pic = picMap.get(spot.serial);
      if (!pic) {
        return;
      }

      const globalIdx = currentIndex + i;
      const titleIdx = (((globalIdx - 3) % 10) + 10) % 10;
      const titleClass = `title${titleIdx + 1}`;

      const card = document.createElement("div");
      card.classList.add("relative", "grid-item", titleClass);

      const firstImg = pic.pics?.split(".jpg").at(0) + ".jpg";
      const img = document.createElement("img");
      img.src = picHostURL + firstImg;
      img.alt = spot.sname;

      const star = document.createElement("span");
      star.classList.add(
        "material-symbols-outlined",
        "absolute-star",
        "star-icon"
      );
      star.textContent = "kid_star";

      const absBox = document.createElement("div");
      absBox.classList.add("absolute-box", "bg-opacity", "w-full");

      const title = document.createElement("p");
      title.textContent = spot.sname;

      absBox.appendChild(title);
      card.append(img, star, absBox);
      newGridBox.appendChild(card);
    });
    const allGridBoxes = gridContainer.querySelectorAll(".grid-box");
    const promotionBox = gridContainer.querySelector(".promotion-box");
    if (allGridBoxes.length === 0) {
      promotionBox
        ? promotionBox.after.after(newGridBox)
        : gridContainer.appendChild(newGridBox);
    } else {
      const last = allGridBoxes[allGridBoxes.length - 1];
      last.after(newGridBox);
    }
    currentIndex += nextBatch.length;
  });
}
