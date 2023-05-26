// Selecting the form and its inputs and error messages
const form = document.querySelector(".contactform");
const userName = document.querySelector("#name");
const nameError = document.querySelector("#name-error");
const subject = document.querySelector("#subject");
const subjectError = document.querySelector("#subject-error");
const email = document.querySelector("#email");
const emailError = document.querySelector("#email-error");
const message = document.querySelector("#message");
const messageError = document.querySelector("#message-error");
const formSuccess = document.querySelector("#form-success");

// This function checks if a string has more characters than a certain number (len)
function length(value, len) {
  if (value.trim().length > len) {
    return true;
  } else {
    return false;
  }
}

// This function validates an email using a simple Regular Expression
function validateEmail(email) {
  const regEx = /\S+@\S+\.\S+/;
  const patternMatches = regEx.test(email);
  return patternMatches;
}

// Form validation
function validateForm(event) {
  event.preventDefault();

  let isValid = true;

  // Check the length of the name, it should be longer than 5 characters
  if (length(userName.value, 5) === true) {
    nameError.style.display = "none"; // If valid, hide the error message
  } else {
    nameError.style.display = "block"; // If not valid, show the error message
    isValid = false; // Set isValid to false to prevent form submission
  }

  if (length(subject.value, 15) === true) {
    subjectError.style.display = "none";
  } else {
    subjectError.style.display = "block";
    isValid = false;
  }

  if (validateEmail(email.value) === true) {
    emailError.style.display = "none";
  } else {
    emailError.style.display = "block";
    isValid = false;
  }

  if (length(message.value, 25) === true) {
    messageError.style.display = "none";
  } else {
    messageError.style.display = "block";
    isValid = false;
  }

  if (isValid) {
    // If valid, construct an object from the form inputs. 
    const formData = {
      name: userName.value,
      subject: subject.value,
      email: email.value,
      message: message.value,
    };

    fetch(
      "https://gamehub.olekristianfrontend.no/wp-json/myplugin/v1/contact", //sends POST requests with the form data to WordPress, using a custom endpoint, can be fetched using custom endpoint: https://gamehub.olekristianfrontend.no/wp-json/myplugin/v1/formdata
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    )
      
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        // Clear input fields after successful data submission
        userName.value = "";
        subject.value = "";
        email.value = "";
        message.value = "";
        formSuccess.style.display = "block"; // Show success message on successful submission
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("There was an error submitting your comment. Please try again."); //show an alert indicating failed submission
      });
  }
}

// Attach the form validation function to the form's "submit" event
form.addEventListener("submit", validateForm);
