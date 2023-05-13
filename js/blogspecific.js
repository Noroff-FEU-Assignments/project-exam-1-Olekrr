import { getSpecificPost, postComment, getCommentSection } from "./api.js";

const container = document.querySelector(".blog");
const title = document.querySelector(".title");
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");

async function displaySpecificPost() {
  const post = await getSpecificPost(id);
  title.innerHTML = `Meta Corner | ${post.title.rendered}`;
  container.innerHTML = `
  <h1>${post.title.rendered}</h1>
  <div>${post.content.rendered}</div>
  `;
  
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('click', () => {
      modal.style.display = "block";
      modalImg.src = img.src;
    });
  });

  displayComments(id);
}


async function displayComments(postId) {
  const comments = await getCommentSection(postId);
  const commentsContainer = document.querySelector(".comments");
  commentsContainer.innerHTML = "";
  comments.forEach((comment) => {
    commentsContainer.innerHTML += `
      <div class="comment">
        <h3>${comment.author_name}</h3>
        <p>${comment.content.rendered}</p>
      </div>`;
  });
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
    displayComments(id);
  } catch (error) {
    console.error("Error:", error);
    alert("There was an error submitting your comment. Please try again.");
  }
});


let modal = document.getElementById('myModal');


let modalImg = document.getElementById('img01');


window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
