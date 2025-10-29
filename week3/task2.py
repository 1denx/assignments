import urllib.request as req
import bs4
import csv
# url = "https://www.ptt.cc/bbs/Steam/index.html"

# Article 類別
class Article:
    def __init__(self, title, likes, publish_time):  # self 是固定參數，可再放入其他參數
        self.title = title
        self.likes = likes
        self.publish_time = publish_time
    
    def __str__(self):
        return f"{self.title},{self.likes},{self.publish_time}"

def get_date(article_url):
    with req.urlopen(article_url) as response:
        article_data = response.read().decode("utf-8")
        article_root = bs4.BeautifulSoup(article_data, "html.parser")
        metaline = article_root.find_all("div", class_="article-metaline")
        for meta in metaline:
            tag = meta.find("span", class_="article-meta-tag")
            if tag.string == "時間":
                value = meta.find("span", class_="article-meta-value")
                if value.string is not None:
                    return value.string
                else:
                    return ""  # 避免被刪除文章造成中斷
    return ""


def get_data(url):
    request = req.Request(url, headers={
        "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
    })

    with req.urlopen(request) as response:
        data = response.read().decode("utf-8")
    # print(data)

    # 解析原始碼，取得每篇文章的標題
    root = bs4.BeautifulSoup(data, "html.parser")
    article_data = root.find_all("div", class_="r-ent")
    articles = []

    for article in article_data:
        title = article.find("div", class_="title")
        if title.a != None:  # 如果標題包含 <a> (沒有被刪除)，就印出來
            title_str = title.a.string
            article_url = "https://www.ptt.cc" + title.a["href"]
            date_str = get_date(article_url)
            # print(title_str,date_str)
        else:
            continue
        likes = article.find("div", class_="nrec")
        if likes.span != None:
            likes_str = likes.span.string
        else:
            likes_str = "0"
        
        valid_article = Article(title_str, likes_str, date_str)
        articles.append(valid_article)
    
    for article in articles:
        print(article)

    # 抓取上一頁的連結
    next_link = root.find("a", string="‹ 上頁")
    next_url = "https://www.ptt.cc" + next_link["href"] if next_link else None
    return next_url,articles

def get_all_articles_page(start_page_url, end_page):
    current_page = start_page_url
    count = 0
    all_articles = []
    while count <= end_page:
        current_page, articles = get_data(current_page)
        all_articles.extend(articles)
        if current_page is None:
            break
        count += 1
    return all_articles


def write_csv(articles):
    with open("articles.csv", mode="w", encoding="utf-8", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["文章標題","推文數","發布時間"])
        for article in articles:
            writer.writerow([article.title, article.likes, article.publish_time])

start_page_url = "https://www.ptt.cc/bbs/Steam/index.html"
all_articles = get_all_articles_page(start_page_url,2)
write_csv(all_articles)