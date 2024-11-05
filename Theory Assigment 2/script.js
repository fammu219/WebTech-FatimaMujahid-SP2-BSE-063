// validation.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("gform");
    const fields = [
      { id: "firstName", message: "*Please enter your first name" },
      { id: "lastName", message: "*Please enter your last name" },
      { id: "email", message: "*Please enter a valid email address" },
      { id: "phoneNumber", message: "*Please enter your phone number" },
      { id: "address", message: "*Please enter your address" },
      { id: "city", message: "*Please enter your city" },
    ];
  
    form.addEventListener("submit", (event) => {
      let isValid = true;
  
      // Loop through each field to validate
      fields.forEach((field) => {
        const inputElement = document.getElementById(field.id);
        const errorMessage = inputElement.nextElementSibling;
  
        // If the field is empty, display the error message
        if (inputElement.value.trim() === "") {
          errorMessage.style.display = "block";
          isValid = false;
        } else {
          errorMessage.style.display = "none";
        }
      });
  
      // If any field is invalid, prevent form submission
      if (!isValid) {
        event.preventDefault();
      } else {
        // If the form is valid, display success alert
        alert("Order has been placed successfully!");
      }
    });
  });
  