// Import the necessary function from the API module
import { getPosts as getPostsFromApi } from "./api.js";

// Get the DOM elements for the containers where the posts will be displayed
const reviewsContainer = document.querySelector(".reviews-post-container");
const newsContainer = document.querySelector(".news-post-container");
const trendingContainer = document.querySelector(".trending-posts-container");

// Get the DOM elements for the loaders for each of the categories
const reviewsLoader = document.querySelector(".reviews-container .loader");
const newsLoader = document.querySelector(".news-container .loader");
const trendingLoader = document.querySelector(".trending-container .loader");

//URL parameters to fetch posts for each category
const reviewsUrlParameters = "&categories=19";
const newsUrlParameters = "&categories=20";
const trendingUrlParameters = "&categories=21";

// A general-purpose function to fetch posts for a given category and display them in a given container
async function getPosts(urlParameters, container, loader, showImage = true) {
  const results = await getPostsFromApi(urlParameters);

  // Create a new container for these posts
  let postContainer = document.createElement("div");
  postContainer.classList.add("post-container");

  for (let i = 0; i < results.length; i++) {
    const post = results[i];
    let imgHtml = "";
    let postHtml = "";

    // If showImage parameter is true, display the post with its image
    if (showImage) {
      const featuredUrl = post._embedded["wp:featuredmedia"][0];
      loader.style.display = "none";
      imgHtml = `<img class="post-image" src="${featuredUrl.source_url}" alt="${featuredUrl.alt_text}">`;
      postHtml = `
        <a href="blogspecific.html?id=${post.id}" class="sectionpost">
          <article class="post-item">
            <h3>${post.title.rendered}</h3>
            ${imgHtml}
          </article>
        </a>
      `;
    // If showImage parameter is false, display the post without its image (just the title)
    } else {
      loader.style.display = "none";
      postHtml = `
        <article class="sectionpost trending-post">
          <a href="blogspecific.html?id=${post.id}">
            <h3>${post.title.rendered}</h3>
          </a>
        </article>
      `;
    }

    // Create a new DOM element for this post and append it to the post container
    let postElement = document.createElement("div");
    postElement.innerHTML = postHtml;
    postContainer.appendChild(postElement);
  }
  // Add the container of posts to the main container for this category
  container.appendChild(postContainer);
}

// Fetch and display posts for each category
getPosts(reviewsUrlParameters, reviewsContainer, reviewsLoader);
getPosts(newsUrlParameters, newsContainer, newsLoader);
getPosts(trendingUrlParameters, trendingContainer, trendingLoader, false);
