const api_key='140c1074224f4a21ad30e882f4092dfc'
let newsList =[];
const pageSize = 10;
let page = 2;
let category = ""; 
let keyword = ""; 
const getLatestNews = async () =>{
   
    /*const url = new URL(
        `https://newsapi.org/v2/top-headlines?country=us&pageSize=${pageSize}&page=${page}${category}${keyword}&apiKey=${api_key}`
    ); 
    const response = await fetch(url);*/
    const url = new URL(
        `https://stephnews.netlify.app/top-headlines?country=us&pageSize=${pageSize}&page=${page}${category}${keyword}`
    ); 

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
  const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
};
  const render =()=>{
    const newsHTML = 
    newsList.map(
        (news) =>
            `<div class="row news">
                <div class="col-lg-4">
                    <img class="news-img-size" src="
                    ${news.urlToImage || 'https://via.placeholder.com/150?text=IMAGE+NOT+AVAILABLE'}" alt="News Image" />
                </div>
                <div class="col-lg-8">
                    <h2>${news.title}</h2>
                     <p>${truncateText(news.description || "내용 없음", 200)}</p>
                    <div>
                        ${news.source.name ||"No source" } * ${news.publishedAt}
                    </div>
                </div>
            </div>
            `).join('');

    document.getElementById("news-board").innerHTML =newsHTML;

  }

getLatestNews();