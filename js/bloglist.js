//Imports the neccessary function from the API module
import { getPosts } from "./api.js";

//var's for posts and filtered results
let allPosts;
let filteredResults;

//html references
const contentContainer = document.querySelector(".content-container");
const filterDropdown = document.getElementById("filter-dropdown");
const viewMoreButton = document.getElementById("view-more");


async function fetchAllPosts() {
  allPosts = await getPosts();
}

function displayPosts(
  results, //list of blog posts
  limit, //max number to display
  startIndex = 0, //start of the index for first post to display
  includeEmptyPosts = false //whether to include empty posts as placeholder for a better looking grid view on larger screens
) {
  // remove any existing empty posts to avoid multiple placeholders messing with the layout
  document.querySelectorAll(".empty-post").forEach((el) => el.remove());

  //initialize html for posts
  let postHTML = "";
  let emptyPostHTML = "";

  // Generate HTML for each post
  for (let i = startIndex; i < startIndex + limit && i < results.length; i++) {
    const post = results[i];
    const featuredUrl = post._embedded["wp:featuredmedia"][0];

    postHTML += `
      <a href="blogspecific.html?id=${post.id}">
        <div class="post-item">
          <h3>${post.title.rendered}</h3>
          <img src="${featuredUrl.source_url}" alt="${featuredUrl.alt_text}">
        </div>
      </a>
    `;
  }

  // generate the HTML for the empty posts if total number of displayed posts is not a multiple of 5, to keep grid a nice grid view of rows as 5.
  const totalDisplayedPosts = Math.min(startIndex + limit, results.length);
  if (includeEmptyPosts && totalDisplayedPosts % 5 !== 0) {
    for (let i = totalDisplayedPosts % 5; i < 5; i++) {
      emptyPostHTML += `<div class="empty-post"></div>`;
    }
  }

  //adding the HTML to the posts
  contentContainer.innerHTML += postHTML + emptyPostHTML;
}

//function to toggle view more button
function toggleViewMoreButton(results, displayedCount) {
  if (results.length > displayedCount) { //if there are more posts than currently being shown, show the button
    viewMoreButton.style.display = "block";
  } else { //if all posts are currently displayed, hide button
    viewMoreButton.style.display = "none";
  }
}

//filter function
async function filterPosts(filter) { //selected filter
  //filters posts based on selected filter
  if (filter === "review") {
    filteredResults = allPosts.filter((post) => post.categories.includes(19)); //filters to reviews category
  } else if (filter === "news") {
    filteredResults = allPosts.filter((post) => post.categories.includes(20)); //filters to news category
  } else if (filter === "date old") {  //sorts based on date added, showing older entries first
    filteredResults = [...allPosts].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  } else if (filter === "date new") { //sorts based on date added, showing newer entries first
    filteredResults = [...allPosts].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  } else { //if no filter selected, show all by default.
    filteredResults = allPosts;
  }

  //clear the container
  contentContainer.innerHTML = "";
  //display the first 10 filtered posts, and include empty posts as placeholders for a nicer view on bigger screens
  displayPosts(filteredResults, 10, 0, window.innerWidth > 1024);
  //call the toggle view more button function
  toggleViewMoreButton(filteredResults, 10);
}

//event listener for changes in the filters dropdown value
filterDropdown.addEventListener("change", () => {
  const selectedFilter = filterDropdown.value; //get the selected filter
  filterPosts(selectedFilter); //filter based on selected filter
});

//fetch all posts, filter to all by default then show them.
fetchAllPosts().then(() => {
  filterPosts("all");
});

//event listener for view more button
viewMoreButton.addEventListener("click", () => {
  //get the current number of displayed posts
  const currentPostsCount =
    contentContainer.querySelectorAll(".post-item").length;
  
  //dispolay the next 10 posts, include empty posts as placeholders for bigger screens
  displayPosts(
    filteredResults,
    10,
    currentPostsCount,
    window.innerWidth > 1024
  );

  //show or hide the view more button.
  toggleViewMoreButton(filteredResults, currentPostsCount + 10);
});
