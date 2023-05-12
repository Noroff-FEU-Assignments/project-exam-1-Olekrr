import { getSpecificPost, postComment } from './api.js';

const container = document.querySelector(".blog");
const title = document.querySelector(".title")
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");

async function displaySpecificPost() {
  const post = await getSpecificPost(id);
  title.innerHTML = `Meta Corner | ${post.title.rendered}`
  container.innerHTML = `<div>${post.content.rendered}</div>`;
}

displaySpecificPost();

const commentForm = document.getElementById("submit-comment-form");

commentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const author = document.getElementById("comment-author").value;
  const email = document.getElementById("comment-email").value;
  const content = document.getElementById("comment-content").value;

  const commentData = {
    author_name: author,
    author_email: email,
    content: content,
    post: id,
  };

  try {
    await postComment(commentData);
    alert("Comment submitted successfully!");
    document.getElementById("comment-author").value = "";
    document.getElementById("comment-email").value = "";
    document.getElementById("comment-content").value = "";
  } catch (error) {
    console.error("Error:", error);
    alert("There was an error submitting your comment. Please try again.");
  }
});

