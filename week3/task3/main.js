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
let currentIndex = 0;
const infoUrl = "https://cwpeng.github.io/test/assignment-3-1";
const imgUrl = "https://cwpeng.github.io/test/assignment-3-2";
const picHostURL = "https://www.travel.taipei";
let picMapGlobal = null;

// Dom 完全加載後執行
document.addEventListener("DOMContentLoaded", async () => {
  await initPage();
});

// 頁面初始化
async function initPage() {
  // 加載資料
  try {
    const [spotsRes, picsRes] = await Promise.all([
      fetch(infoUrl),
      fetch(imgUrl),
    ]);
    if (!spotsRes.ok || !picsRes.ok) {
      throw new Error("Could not fetch resource");
    }

    const spotsData = await spotsRes.json();
    const picsData = await picsRes.json();

    spots = spotsData.rows || [];
    pics = picsData.rows || [];
    // console.log(spots, pics);

    // 建立 picMap 工具
    picMapGlobal = new Map(pics.map((p) => [p.serial, p]));

    renderPage();
    setupLoadMore();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// 渲染畫面
function renderPage() {
  const promotionEls = document.querySelectorAll(".promotion");
  const promotionBox = document.querySelector(".promotion-box");

  // 渲染前 3 筆
  const firstThree = spots.slice(0, 3);
  firstThree.forEach((spot, i) => {
    const el = promotionEls[i];
    if (!el) {
      return;
    }
    // 找出景點對應的圖片資料
    const pic = picMapGlobal.get(spot.serial);
    if (!pic) {
      return;
    }

    let img = el.querySelector("img");
    if (!img) {
      img = document.createElement("img");
      el.appendChild(img);
    }
    let p = el.querySelector("p");
    if (!p) {
      p = document.createElement("p");
      el.appendChild(p);
    }
    const firstImg = pic.pics?.split(".jpg").at(0) + ".jpg";
    img.src = picHostURL + firstImg;
    img.alt = spot.sname;
    p.textContent = spot.sname;
  });

  // 初始 grid-box 與 10 個 grid-item（若無則建立）
  let gridBox = document.querySelector(".grid-box");
  if (!gridBox) {
    gridBox = document.createElement("div");
    gridBox.classList.add("grid-box");
    // 插在 promotion-box 之後（若 promotion-box 有存在）
    if (promotionBox) {
      promotionBox.after(gridBox);
    } else {
      document.querySelector(".grid-container")?.appendChild(gridBox);
    }
  }
  const nextSpots = spots.slice(3, 13); // 初始 10 筆
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
  const gridItems = gridBox.querySelectorAll(".grid-item");
  nextSpots.forEach((spot, i) => {
    const el = gridItems[i];
    const pic = picMapGlobal.get(spot.serial);
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

  // 設定 currentIndex 為已使用的筆數
  currentIndex = 3 + nextSpots.length;
}

// 顯示更多
function setupLoadMore() {
  const moreBtn = document.querySelector(".more_btn");
  const gridContainer = document.querySelector(".grid-container");

  if (!moreBtn || !gridContainer) return;

  moreBtn.addEventListener("click", async () => {
    // disable 按鈕避免重複點擊
    moreBtn.disabled = true;
    const oldText = moreBtn.textContent;
    moreBtn.textContent = "載入中";

    const nextBatch = spots.slice(currentIndex, currentIndex + 10);
    if (nextBatch.length === 0) {
      moreBtn.textContent = "資料已到底";
      return;
    }

    const newGridBox = document.createElement("div");
    newGridBox.classList.add("grid-box");
    const frag = document.createDocumentFragment();

    for (let i = 0; i < nextBatch.length; i++) {
      const spot = nextBatch[i];
      const pic = picMapGlobal.get(spot.serial);
      if (!pic) continue;

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
      frag.appendChild(card);
    }
    newGridBox.appendChild(frag);

    // 一開始隱藏新 box
    newGridBox.style.opacity = "0";
    newGridBox.style.transform = "translateY(30px)";

    // 將 newGridBox 插到最後一個 .grid-box 之後
    const allGridBoxes = gridContainer.querySelectorAll(".grid-box");
    if (allGridBoxes.length > 0) {
      const last = allGridBoxes[allGridBoxes.length - 1];
      last.after(newGridBox);
    } else {
      gridContainer.appendChild(newGridBox);
    }

    // 延遲觸發動畫
    requestAnimationFrame(() => {
      newGridBox.style.transition = "all 0.6s ease";
      newGridBox.style.opacity = "1";
      newGridBox.style.transform = "translateY(0)";
    });

    currentIndex += nextBatch.length;

    // restore button
    moreBtn.disabled = false;
    moreBtn.textContent = oldText;

    // 若已到底，禁用並提示
    if (currentIndex >= spots.length) {
      moreBtn.textContent = "資料已到底";
      moreBtn.disabled = true;
    }
  });
}
