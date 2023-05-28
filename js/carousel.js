//Imports the neccessary function from the API module
import { getPosts } from "./api.js";

//html references
const slideContainer = document.querySelector(".carousel-slides-container");
const loader = document.querySelector(".loader");

//function for creating slides
async function createSlides() {
  const results = await getPosts();

  //creates new html div element for slides and gives it a class
  let slide = document.createElement("div");
  slide.classList.add("carousel-slide");

  //loop through the fetched results
  for (let i = 0; i < results.length; i++) {
    const post = results[i];
    const featuredUrl = post._embedded["wp:featuredmedia"][0];
    loader.style.display = "none"; //hide loader
    //add html to the slide
    slide.innerHTML += ` 
    <a href="blogspecific.html?id=${post.id}">
      <article class="post" role="listitem" aria-live="polite">
        <h3><span aria-hidden="true">${post.title.rendered}</span></h3>
        <img src="${featuredUrl.source_url}" alt="${featuredUrl.alt_text}">
      </article>
    </a>
    `;

    // If the current post is the 4th post in the slide or the last post in the results,
    // append the slide to the slide container and start a new slide
    if ((i + 1) % 4 == 0 || i == results.length - 1) {
      slideContainer.appendChild(slide);

      if (i != results.length - 1) {
        slide = document.createElement("div");
        slide.classList.add("carousel-slide");
      }
    }
  }

  //calls the initCarousel function
  initCarousel();
}

//calls createSlides function to fetch posts, create and display slides.
createSlides();


//Carousel function
function initCarousel() {

  let slideIndex = 0; //variable that will keep track of the currently displayed slide
  const slides = document.getElementsByClassName("carousel-slide"); // Get a list of all elements with the class "carousel-slide". This list represents all the slides in the carousel

  //function for showing slides
  function showSlide(index) { 

    //loops through each slide in the "slides" list
    for (let i = 0; i < slides.length; i++) {

      // Use the CSS transform property to move each slide to the left by a distance equal to the index multiplied by 100%.
      // This effectively moves the slide at the specified index into view, and moves previous slides out of view.
      slides[i].style.transform = `translateX(-${index * 100}%)`;
    }
  }
  //function to show previous slides
  function prevSlide() {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length; // Decrease the slide index by 1, wrapping around to the end of the list if necessary
    showSlide(slideIndex); // Call the "showSlide" function to update the display
  }

  //function to show next slide
  function nextSlide() { 
    slideIndex = (slideIndex + 1) % slides.length; // Increase the slide index by 1, wrapping around to the start of the list if necessary
    showSlide(slideIndex); // Call the "showSlide" function to update the display
  }

  // Display the first slide when the carousel is initialized
  showSlide(slideIndex);

  // Event listeners to the previous and next buttons.
  // When the previous button is clicked, the "prevSlide" function will be called.
  // When the next button is clicked, the "nextSlide" function will be called.
  document.querySelector(".prev-btn").addEventListener("click", prevSlide);
  document.querySelector(".next-btn").addEventListener("click", nextSlide);
}