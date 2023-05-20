import { getPosts as getPostsFromApi } from './api.js';

const slideContainer = document.querySelector(".carousel-slides-container");
const loader = document.querySelector(".loader")

async function getPosts() {
  const results = await getPostsFromApi();

  let slide = document.createElement("div");
  slide.classList.add("carousel-slide");

  for (let i = 0; i < results.length; i++) {
    const post = results[i];
    const featuredUrl = post._embedded['wp:featuredmedia'][0];
    loader.style.display = "none";
    slide.innerHTML += `
    <a href="blogspecific.html?id=${post.id}">
      <div class="post">
        <h3><span>${post.title.rendered}</span></h3>
        <img src="${featuredUrl.source_url}" alt="${featuredUrl.alt_text}">
      </div>
      </a>
    `;

    if ((i + 1) % 4 == 0 || i == results.length - 1) {
      slideContainer.appendChild(slide);

      if (i != results.length - 1) {
        slide = document.createElement("div");
        slide.classList.add("carousel-slide");
      }
    }
  }

  initCarousel();
}

getPosts();

function initCarousel() {
  let slideIndex = 0;
  const slides = document.getElementsByClassName("carousel-slide");

  function showSlide(index) {
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.transform = `translateX(-${index * 100}%)`;
    }
  }

  function prevSlide() {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    showSlide(slideIndex);
  }

  function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
  }

  showSlide(slideIndex);

  document.querySelector(".prev-btn").addEventListener("click", prevSlide);
  document.querySelector(".next-btn").addEventListener("click", nextSlide);
}

