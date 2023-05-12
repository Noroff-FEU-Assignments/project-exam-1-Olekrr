import { getPosts as getPostsFromApi } from './api.js';

const reviewsContainer = document.querySelector(".reviews-container");
const newsContainer = document.querySelector(".news-container");

const reviewsUrlParameters = "&categories=19"; 
const newsUrlParameters = "&categories=20"; 

async function getPosts(urlParameters, container) {
  const results = await getPostsFromApi(urlParameters);
  console.log(results);

  for (let i = 0; i < results.length; i++) {
    const post = results[i];
    const featuredImageUrl = post._embedded['wp:featuredmedia'][0].source_url;

    container.innerHTML +=  `
      <a href="blogspecific.html?id=${post.id}">
        <div class="sectionpost">
          <h4>${post.title.rendered}</h4>
          <img class="section-image" src="${featuredImageUrl}" alt="${post.title.rendered}">
        </div>
      </a>
    `;
  }
}

getPosts(reviewsUrlParameters, reviewsContainer);
getPosts(newsUrlParameters, newsContainer);


