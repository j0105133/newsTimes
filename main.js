//https://stephnews.netlify.app/top-headlines?
//const api_key = '140c1074224f4a21ad30e882f4092dfc';
let newsList = [];
const menus = document.querySelectorAll(".menus button");
const sideMenuList = document.querySelectorAll(".side-menu-list button");

sideMenuList.forEach(sideMenu => 
    sideMenu.addEventListener("click", (event) =>{
        closeNav();
        getNewsByCategory(event);
    })
);

menus.forEach(menu => 
    menu.addEventListener("click", (event) => getNewsByCategory(event))
);

let category = ""; 
let keyword = ""; 
let totalResults=0;
let page =1;
const pageSize =10;
const groupSize =5;
let currentUrl;

// 뉴스 불러오기

// fetchNews 함수
const fetchNews = async (url) => {
    try {
        url.searchParams.set("page",page);
        url.searchParams.set("pageSize",pageSize);
        const response = await fetch(url);
        const data = await response.json();
      

        if (response.status === 200) { // 응답 상태 코드가 200인 경우 에러 처리
            if(data.articles.length ===0){
                throw new Error("No result for this search");
            }
            newsList = data.articles;
            totalResults = data.totalResults;

            render();
            paginationRender();

        }else{
            throw new Error (data.message);
        }
    } catch (error) {
        errorRender(error.message);
        
    }
};

const getLatestNews = async () => {
   
    if (keyword) { // keyword 검색시
        currentUrl = new URL(`https://stephnews.netlify.app/top-headlines?`);
        currentUrl.searchParams.set("q", keyword);
        //currentUrl.searchParams.set("apiKey", api_key);
    } else { 
        currentUrl = new URL(`https://stephnews.netlify.app/top-headlines?`);
        currentUrl.searchParams.set("country", "us");
       //currentUrl.searchParams.set("apiKey", api_key);
    }
    page = 1; // 새로운 검색 시 페이지를 1로 초기화
    await fetchNews(currentUrl);
};

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
    keyword = ""; // 카테고리 검색시 keyword 초기화

    currentUrl = new URL(`https://stephnews.netlify.app/top-headlines?`);
    currentUrl.searchParams.set("country", "us");
    currentUrl.searchParams.set("category", category);
    //currentUrl.searchParams.set("apiKey", api_key);
    page = 1; // 새로운 카테고리 선택 시 페이지를 1로 초기화 
    await fetchNews(currentUrl);
};

// 검색창 입력 후 뉴스 불러오기
const searchNews = async () => {
    keyword = document.getElementById("search-input").value;
    await getLatestNews();
    
    document.getElementById("search-input").value = ""; // 검색 후 텍스트 삭제
};

// 마우스로 버튼 클릭 시 검색
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

const errorRender = (errorMessage) =>{
    const errorHTML =
    `<div class="alert alert-danger" role="alert">
    ${errorMessage}!
    </div>`;
    document.getElementById("news-board").innerHTML = errorHTML;
};


const paginationRender = () =>{
    const totalPage = Math.ceil(totalResults / pageSize);
    const pageGroup = Math.ceil(page / groupSize);
    const lastPage = Math.min(pageGroup * groupSize, totalPage);
    const firstPage = Math.max(lastPage - (groupSize - 1), 1);
    let paginationHTML ='';
    
        if (page > 1) {
            paginationHTML += `<li class="page-item" onclick="moveToPage(${1})"><a class="page-link" href="#"><<</a></li>`; // 처음으로 이동 
            paginationHTML += `<li class="page-item" onclick="moveToPage(${page - 1})"><a class="page-link" href="#"><</a></li>`; // 이전 페이지로 이동 
        };
        
        
        if (totalPage <= 5) {
            for (let i = 1; i <= totalPage; i++) {
                paginationHTML += `<li class="page-item ${i === page ? 'active' : ''}" onclick="moveToPage(${i})"><a class="page-link" href="#">${i}</a></li>`;
            }
        } else {
            for (let i = firstPage; i <= lastPage; i++) {
                paginationHTML += `<li class="page-item ${i === page ? 'active' : ''}" onclick="moveToPage(${i})"><a class="page-link" href="#">${i}</a></li>`;
            }
        }
    
        if (page < totalPage) {
            paginationHTML+= `<li class="page-item" onclick="moveToPage(${page+1})"><a class="page-link" href="#">></a></li>` 
            paginationHTML += `<li class="page-item" onclick="moveToPage(${totalPage})"><a class="page-link" href="#">>></a></li>`; // 마지막으로 이동 
        }
    
    document.querySelector(".pagination").innerHTML = paginationHTML;
};
const moveToPage = async (pageNum)=>{
   console.log("movetopage",pageNum);
   page =pageNum;
   await fetchNews(currentUrl);
   window.scrollTo(0, 0);

};
getLatestNews();
