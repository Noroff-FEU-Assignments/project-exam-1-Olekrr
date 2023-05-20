import { getSpecificPost, postComment, getCommentSection } from "./api.js";

const container = document.querySelector(".blog");
const title = document.querySelector(".title");
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");

let modal = document.getElementById("myModal");

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

async function displaySpecificPost() {
  const post = await getSpecificPost(id);
  title.innerHTML = `Meta Corner | ${post.title.rendered}`;
  container.innerHTML = `
  <h1>${post.title.rendered}</h1>
  <div>${post.content.rendered}</div>
  `;
  displayImagesInModal();
  await displayComments(id);
}

function displayImagesInModal() {
  const images = container.querySelectorAll("img");
  images.forEach((img) => {
    img.addEventListener("click", () => {
      let modalImg = document.createElement("img");
      modalImg.classList.add("modal-content");
      modalImg.id = "img01";
      modalImg.src = img.src;

      let oldImg = modal.querySelector(".modal-content");
      if (oldImg) {
        modal.removeChild(oldImg);
      }

      modal.appendChild(modalImg);

      modal.style.display = "block";
    });
  });
}

async function displayComments(postId) {
  const comments = await getCommentSection(postId);
  const commentsContainer = document.querySelector(".comments");
  commentsContainer.innerHTML = "";
  comments.forEach((comment) => {
    commentsContainer.innerHTML += `
      <div class="comment">
        <h4>${comment.author_name}</h4>
        <p>${comment.content.rendered}</p>
      </div>`;
  });
}

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
    await displayComments(id);
  } catch (error) {
    console.error("Error:", error);
    alert("There was an error submitting your comment. Please try again.");
  }
});

displaySpecificPost();
