import { getPosts as getPostsFromApi } from './api.js';

const reviewsContainer = document.querySelector(".reviews-post-container");
const newsContainer = document.querySelector(".news-post-container");
const trendingContainer = document.querySelector(".trending-posts-container");
const reviewsLoader = document.querySelector(".reviews-container .loader");
const newsLoader = document.querySelector(".news-container .loader");
const trendingLoader = document.querySelector(".trending-container .loader");

const reviewsUrlParameters = "&categories=19"; 
const newsUrlParameters = "&categories=20"; 
const trendingUrlParameters = "&categories=21"; 

async function getPosts(urlParameters, container, loader, showImage = true) {
  const results = await getPostsFromApi(urlParameters);
  // Create a new div to contain the posts
  let postContainer = document.createElement("div");
  postContainer.classList.add("post-container");

  for (let i = 0; i < results.length; i++) {
    const post = results[i];
    let imgHtml = '';
    let postHtml = '';

    if (showImage) {
      const featuredUrl = post._embedded['wp:featuredmedia'][0];
      loader.style.display = "none"
      imgHtml = `<img class="post-image" src="${featuredUrl.source_url}" alt="${featuredUrl.alt_text}">`;
      postHtml = `
        <a href="blogspecific.html?id=${post.id}" class="sectionpost">
          <div class="post-item">
            <h3>${post.title.rendered}</h3>
            ${imgHtml}
          </div>
        </a>
      `;
    } else {
      loader.style.display = "none"
      postHtml = `
        <div class="sectionpost trending-post">
          <a href="blogspecific.html?id=${post.id}">
            <h3>${post.title.rendered}</h3>
          </a>
        </div>
      `;
    }

    // Create a new post element and set its innerHTML
    let postElement = document.createElement("div");
    postElement.innerHTML = postHtml;
    postContainer.appendChild(postElement);
  }
  

  // Append the new div to the container
  container.appendChild(postContainer);
}



getPosts(reviewsUrlParameters, reviewsContainer, reviewsLoader);
getPosts(newsUrlParameters, newsContainer, newsLoader);
getPosts(trendingUrlParameters, trendingContainer, trendingLoader, false);

