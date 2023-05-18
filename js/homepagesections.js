import { getPosts as getPostsFromApi } from './api.js';

const reviewsContainer = document.querySelector(".reviews-post-container");
const newsContainer = document.querySelector(".news-post-container");
const trendingContainer = document.querySelector(".trending-container .trending-posts-container");

const reviewsUrlParameters = "&categories=19"; 
const newsUrlParameters = "&categories=20"; 
const trendingUrlParameters = "&categories=21"; 

async function getPosts(urlParameters, container, showImage = true) {
  const results = await getPostsFromApi(urlParameters);
  console.log(results);

  // Create a new div to contain the posts
  let postContainer = document.createElement("div");
  postContainer.classList.add("post-container");

  for (let i = 0; i < results.length; i++) {
    const post = results[i];
    let imgHtml = '';
    let postHtml = '';

    if (showImage) {
      const featuredUrl = post._embedded['wp:featuredmedia'][0];
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

    // Append the new post element to the postContainer
    postContainer.appendChild(postElement);
  }

  // Append the new div to the container
  container.appendChild(postContainer);
}



getPosts(reviewsUrlParameters, reviewsContainer);
getPosts(newsUrlParameters, newsContainer);
getPosts(trendingUrlParameters, trendingContainer, false);

