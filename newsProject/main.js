const api_key='140c1074224f4a21ad30e882f4092dfc'

const getLatestNews = async ()=>{
    const url = new url (`https://newsapi.org/v2/top-headlines?country=us&apiKey=${api_key}`

    );
     const response = await fetch(url);
     const data = await response.json();
     let news = data.articles;
     console.log("news", news);


};

getLatestNews();