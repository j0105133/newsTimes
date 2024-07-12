const api_key = '140c1074224f4a21ad30e882f4092dfc';
let newsList = [];
const menus = document.querySelectorAll(".menus button");
const sideMenuList = document.querySelectorAll(".side-menu-list button");

sideMenuList.forEach(sideMenu => 
    sideMenu.addEventListener("click", (event) =>{
        closeNav();
         getNewsByCategory(event)
    })
);


menus.forEach(menu => 
    menu.addEventListener("click", (event) => getNewsByCategory(event))
);


let category = ""; 
let keyword = ""; 
//뉴스 불러오기
const getLatestNews = async () => {
    console.log(keyword);
    let url;
    if (keyword) {
        url = 
        new URL(`https://stephnews.netlify.app/top-headlines?q=${keyword}`);
    } else { 
        url = 
        new URL(`https://stephnews.netlify.app/top-headlines?country=us&category=${category}`);
    }
    await fetchNews(url);
};
// fetchNews 함수
const fetchNews = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render();
    console.log("news=", newsList);
};

getLatestNews();

const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";

};

const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
};

const openSearchBox = () => {
    let inputArea = document.getElementById("input-area");
    if (inputArea.style.display === "inline") {
        inputArea.style.display = "none";
    } else {
        inputArea.style.display = "inline";
    }
};

// 카테고리별로 뉴스 불러오기
const getNewsByCategory = async (event) => {
    category = event.target.textContent.toLowerCase();
    console.log(category);
    keyword = ""; 

    const url = 
    new URL(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${api_key}`);
    await fetchNews(url);
};

// 검색창 입력후  뉴스 불러오기
const searchNews = async () => {
    keyword = document.getElementById("search-input").value;
    await getLatestNews();
    
    document.getElementById("search-input").value = "";//검색 후 텍스트 삭제
};

// 마우스로 버튼 클릭시 검색
document.querySelector(".search-button").addEventListener("click", searchNews);
// 엔터로 검색
document.getElementById("search-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchNews();
    }
});
const render = () => {
    const newsHTML = newsList
        .map((news) =>
            `<div class="row news">
                <div class="col-lg-4">
                    <img class="news-img-size" src="${news.urlToImage || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU'}" alt="News Image" />
                </div>
                <div class="col-lg-8">
                    <h2>${news.title}</h2>
                    <p>${news.description == null || news.description == "" ? "내용없음" : news.description.length > 200 ? news.description.substring(0, 200) + "..." : news.description}</p>
                    <div>${news.source.name || "No source"} * ${moment(news.publishedAt).fromNow()}</div>
                </div>
            </div>`
        ).join('');

    document.getElementById("news-board").innerHTML = newsHTML;
};
