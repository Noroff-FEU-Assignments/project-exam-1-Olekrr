//Imports the neccessary functions from the API module
import { getSpecificPost, postComment, getCommentSection } from "./api.js";

//html references
const container = document.querySelector(".blog");
const title = document.querySelector(".title");

//getting querystring from current URL, parsing the query string and extracting the ID parameter
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");


async function displaySpecificPost() {
  const post = await getSpecificPost(id); // fetches specific post using imported function and extracted ID
  title.innerHTML = `Meta Corner | ${post.title.rendered}`; //changes the pages title to the posts title
  
  //updates the blog container with the posts title and content
  container.innerHTML = `
  <h1>${post.title.rendered}</h1>
  <div>${post.content.rendered}</div>
  `;
  displayImagesInModal(); //calling modal function to handle image click events and show them in a modal
  await displayComments(id); //calling comment function to fetch and display the specific posts comments
}

let modal = document.getElementById("myModal");

function displayImagesInModal() {
  const images = container.querySelectorAll("img"); //select all image elements inside the blog container
  
  images.forEach((img) => {
    img.addEventListener("click", () => { //add event listener for clicks on images.
      let modalImg = document.createElement("img"); //create new image element, not yet visible or part of the DOM.

      //set attributes and source for the new image elements
      modalImg.classList.add("modal-content");
      modalImg.id = "img01";
      modalImg.src = img.src;

      //checks if there is an image inside the modal, and removes it to ensure only the latest clicked image will be in the modal
      let oldImg = modal.querySelector(".modal-content");
      if (oldImg) {
        modal.removeChild(oldImg);
      }

      //appends newly created image to the modal, it is now part of the DOM and visible when the modal is visible
      modal.appendChild(modalImg);

      //makes the modal visible
      modal.style.display = "block";
    });
  });
}

//remove modal when click occurs outside the image
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

//fetches the comments for the specific post
async function displayComments(postId) {
  const comments = await getCommentSection(postId);

  //selects the comment container and resets its content
  const commentsContainer = document.querySelector(".comments");
  commentsContainer.innerHTML = "";

  //for each comment, appends a new comment block to the comment section
  comments.forEach((comment) => {
    commentsContainer.innerHTML += `
      <div class="comment">
        <h4>${comment.author_name}</h4>
        <p>${comment.content.rendered}</p>
      </div>`;
  });
}

//selects the comment form
const commentForm = document.getElementById("submit-comment-form");


commentForm.addEventListener("submit", async (event) => { //event listener for comment submission
  event.preventDefault(); //prevents page from reloading when button is clicked

  //variables to get the user's input from the forms text fields
  const author = document.getElementById("comment-author").value;
  const email = document.getElementById("comment-email").value;
  const content = document.getElementById("comment-content").value;

  //structures the users input as an object that fits the API's requirements
  const commentData = {
    author_name: author,
    author_email: email,
    content: content,
    post: id,
  };

  try {
    await postComment(commentData); //tries to post the data to the API
    alert("Comment submitted successfully!"); //if successful, alerts the user
    
    document.getElementById("comment-author").value = ""; //clears the forms text fields
    document.getElementById("comment-email").value = "";
    document.getElementById("comment-content").value = "";
    await displayComments(id); //refreshes the displayed comments

  } catch (error) { //If an error occurs, logs it and alerts user.
    console.error("Error:", error);
    alert("There was an error submitting your comment. Please try again.");
  }
});

//finally calls the displaySpecificPost function
displaySpecificPost();