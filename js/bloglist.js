import { getPosts } from "./api.js";

let allPosts;
let filteredResults;

const contentContainer = document.querySelector(".content-container");
const filterDropdown = document.getElementById("filter-dropdown");
const viewMoreButton = document.getElementById("view-more");

// Fetching posts from API
async function fetchAllPosts() {
  allPosts = await getPosts();
}


function displayPosts(results, limit, startIndex = 0) {
  // Remove dummy posts used to fill rows.
  document.querySelectorAll(".empty-post").forEach(el => el.remove());

  let postHTML = '';
  let emptyPostHTML = '';

  for (let i = startIndex; i < startIndex + limit && i < results.length; i++) {
    const post = results[i];
    const featuredUrl = post._embedded['wp:featuredmedia'][0];

    postHTML += `
      <a href="blogspecific.html?id=${post.id}">
        <div class="post-item">
          <h3>${post.title.rendered}</h3>
          <img src="${featuredUrl.source_url}" alt="${featuredUrl.alt_text}">
        </div>
      </a>
    `;
  }

  // Create dummy posts to fill out row for cleaner view when view more button is clicked.
  for (let i = results.length % 5; i < 5; i++) {
    emptyPostHTML += `<div class="empty-post"></div>`;
  }

  // adding to container.
  contentContainer.innerHTML += postHTML + emptyPostHTML;
}

// Filter function.
async function filterPosts(filter) {
  if (filter === "review") {
    filteredResults = allPosts.filter(post => post.categories.includes(19));
  } else if (filter === "news") {
    filteredResults = allPosts.filter(post => post.categories.includes(20));
  } else if (filter === "date old") {
    filteredResults = [...allPosts].sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (filter === "date new") {
    filteredResults = [...allPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
  } else {
    filteredResults = allPosts;
  }

  // clear out posts and show new based on chosen filter
  contentContainer.innerHTML = "";
  displayPosts(filteredResults, 10);
  toggleViewMoreButton(filteredResults, 10);
}

// toggels view more button if there are more elements available for filtered category
function toggleViewMoreButton(results, displayedCount) {
  if (results.length > displayedCount) {
    viewMoreButton.style.display = "block";
  } else {
    viewMoreButton.style.display = "none";
  }
}

// view more button listener to load another 10 posts
viewMoreButton.addEventListener("click", () => {
  const currentPostsCount = contentContainer.querySelectorAll(".post-item").length;
  displayPosts(filteredResults, 10, currentPostsCount);
  toggleViewMoreButton(filteredResults, currentPostsCount + 10);
});

// event listener for changes in filtering options
filterDropdown.addEventListener("change", () => {
  const selectedFilter = filterDropdown.value;
  filterPosts(selectedFilter);
});

// fetches posts and starts filter on all
fetchAllPosts().then(() => {
  filterPosts("all");
});





