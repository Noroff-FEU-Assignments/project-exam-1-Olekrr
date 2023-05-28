//Importing necessary functions from the api.js module
import { getSpecificPost, postComment, getCommentSection } from "./api.js";

//selecting DOM elements for later manipulation
const container = document.querySelector(".blog");
const title = document.querySelector(".title");

//getting querystring from current URL, parsing the query string and extracting the ID parameter
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");

// Function to display specific post content using the post id
async function displaySpecificPost() {
  const post = await getSpecificPost(id);
  title.innerHTML = `Meta Corner | ${post.title.rendered}`;

  container.innerHTML = `
  <h1>${post.title.rendered}</h1>
  <div>${post.content.rendered}</div>
  `;

  // After the post is displayed, we prepare the images for the modal view 
  // and display the comments for this post.
  displayImagesInModal();
  await displayComments(id);
}

// This function adds an event listener to every image in the post.
// Clicking an image will display it in a modal view.
let modal = document.getElementById("myModal");

function displayImagesInModal() {
  const images = container.querySelectorAll("img");

  images.forEach((img) => {
    img.addEventListener("click", () => {
      let modalImg = document.createElement("img");

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

// Event listener for clicks outside the modal content.
// Clicking outside the modal content will close the modal.
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

// Selecting form and input elements for form validation and submission
const commentForm = document.getElementById("submit-comment-form");
const author = document.querySelector("#comment-author");
const authorError = document.querySelector("#comment-author-error");
const email = document.querySelector("#comment-email");
const emailError = document.querySelector("#email-error");
const comment = document.querySelector("#comment-content");
const commentError = document.querySelector("#comment-error");
const formSuccess = document.querySelector("#form-success");


// Helper functions for form validation.
// length checks if the input has more than a certain number of characters.
function length(value, len) {
  if (value.trim().length > len) {
    return true;
  } else {
    return false;
  }
}

// validateEmail uses regex to see if the input is a valid email format.
function validateEmail(email) {
  const regEx = /\S+@\S+\.\S+/;
  const patternMatches = regEx.test(email);
  return patternMatches;
}

// Event listener for the form submission.
// On submission, the form fields are validated.
// If the validation passes, the form data is submitted.
commentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  formSuccess.style.display = "none";
  let isValid = true;

  if (length(author.value, 5) === true) {
    authorError.style.display = "none";
  } else {
    authorError.style.display = "block";
    isValid = false;
  }

  if (validateEmail(email.value) === true) {
    emailError.style.display = "none";
  } else {
    emailError.style.display = "block";
    isValid = false;
  }

  if (length(comment.value, 15) === true) {
    commentError.style.display = "none";
  } else {
    commentError.style.display = "block";
    isValid = false;
  }

  if (isValid) {
     //structures the users input as an object that fits the API's requirements
    const commentData = {
      author_name: author.value,
      author_email: email.value,
      content: comment.value,
      post: id,
    };

    try {
      await postComment(commentData); //tries to post the data to the API
      author.value = ""; //clears the forms text fields
      email.value = "";
      comment.value = "";
      await displayComments(id);
      formSuccess.style.display = "block"; //if successful, alerts the user
    } catch (error) { //If an error occurs, logs it and alerts user.
      formSuccess.style.display = "none";
      console.error("Error:", error);
      alert("There was an error submitting your comment. Please try again.");
    }
  }
});
//finally calls the displaySpecificPost function
displaySpecificPost();