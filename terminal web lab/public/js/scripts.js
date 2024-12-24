document.addEventListener("DOMContentLoaded", () => {
    // Signup form validation
    const signupForm = document.querySelector("#signup-form");
    if (signupForm) {
      signupForm.addEventListener("submit", (e) => {
        const name = document.querySelector("#name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value.trim();
        const role = document.querySelector("#role").value.trim();
  
        if (!name || !email || !password || !role) {
          e.preventDefault();
          showError("All fields are required.");
        } else if (!["admin", "customer"].includes(role.toLowerCase())) {
          e.preventDefault();
          showError("Role must be 'admin' or 'customer'.");
        }
      });
    }
  
    // Login form validation
    const loginForm = document.querySelector("#login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value.trim();
  
        if (!email || !password) {
          e.preventDefault();
          showError("Email and password are required.");
        }
      });
    }
  
    // Password toggle visibility
    const togglePassword = document.querySelector("#toggle-password");
    const passwordField = document.querySelector("#password");
    if (togglePassword && passwordField) {
      togglePassword.addEventListener("click", () => {
        const isPasswordVisible = passwordField.getAttribute("type") === "password";
        passwordField.setAttribute("type", isPasswordVisible ? "text" : "password");
        togglePassword.textContent = isPasswordVisible ? "Hide" : "Show";
      });
    }
  
    // Submit button feedback
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
      form.addEventListener("submit", () => {
        const submitButton = form.querySelector("button[type='submit']");
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Submitting...";
        }
      });
    });
  
    // Utility: Display error messages
    function showError(message) {
      const errorDiv = document.querySelector("#error-message");
      if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = "block";
        hideError(); // Automatically hide error after timeout
      }
    }
  
    // Utility: Hide error messages
    function hideError() {
      const errorDiv = document.querySelector("#error-message");
      if (errorDiv) {
        setTimeout(() => {
          errorDiv.style.display = "none";
        }, 3000); // Hide after 3 seconds
      }
    }
  });
  