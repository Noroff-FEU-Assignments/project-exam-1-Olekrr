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
  document.querySelectorAll('.empty-post').forEach(el => el.remove());

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

  for (let i = results.length % 5; i < 5; i++) {
    emptyPostHTML += `<div class="empty-post"></div>`;
  }

  contentContainer.innerHTML += postHTML + emptyPostHTML;
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





