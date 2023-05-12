import { getPosts } from './api.js';

let allPosts;
let filteredResults;

const contentContainer = document.querySelector(".content-container");
const filterDropdown = document.getElementById("filter-dropdown");
const viewMoreButton = document.getElementById('view-more');

async function fetchAllPosts() {
  allPosts = await getPosts();
}

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

  contentContainer.innerHTML = "";
  displayPosts(filteredResults, 10);
  toggleViewMoreButton(filteredResults, 10);
}

filterDropdown.addEventListener("change", () => {
  const selectedFilter = filterDropdown.value;
  filterPosts(selectedFilter);
});

fetchAllPosts().then(() => {
  filterPosts('all');
});

function displayPosts(results, limit, startIndex = 0) {
  for (let i = startIndex; i < startIndex + limit && i < results.length; i++) {
    const post = results[i];
    const featuredImageUrl = post._embedded['wp:featuredmedia'][0].source_url;

    contentContainer.innerHTML += `
      <a href="blogspecific.html?id=${post.id}">
        <div class="post-item">
          <h3>${post.title.rendered}</h3>
          <img src="${featuredImageUrl}" alt="${post.title.rendered}">
        </div>
      </a>
    `;
  }
}

function toggleViewMoreButton(results, displayedCount) {
  if (results.length > displayedCount) {
    viewMoreButton.style.display = 'block';
  } else {
    viewMoreButton.style.display = 'none';
  }
}

viewMoreButton.addEventListener('click', () => {
  const currentPostsCount = contentContainer.querySelectorAll('.post-item').length;
  displayPosts(filteredResults, 10, currentPostsCount);
  toggleViewMoreButton(filteredResults, currentPostsCount + 10);
});





