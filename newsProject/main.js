const api_key='140c1074224f4a21ad30e882f4092dfc'
let news=[];
const pageSize = 10;
let page = 2;
let category = ""; 
let keyword = ""; 
const getLatestNews = async () =>{
    const url = new URL 
    (`https://stephnews.netlify.app/
        top-headlines?country=us
        &pageSize&${pageSize}
        &page=${page}${category}${keyword}`

    );
     const response = await fetch(url);
     const data = await response.json();
     news = data.articles;
     console.log("news=", news);
};

getLatestNews();


