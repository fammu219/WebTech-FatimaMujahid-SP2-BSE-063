// Function to dynamically update the cart count
document.addEventListener("DOMContentLoaded", () => {
    const cartCount = document.getElementById('cart-count');
  
    // Check if the cartCount element exists
    if (cartCount) {
      // Set initial count value
      cartCount.textContent = 0; // Example value
      cartCount.style.display = 'flex'; // Show the badge
    } else {
      console.error('Cart count element not found in the DOM.');
    }
  });

  // Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    // Select all flash messages
    const flashMessages = document.querySelectorAll(".flash-message");

    // Set a timeout to remove the messages after 1 seconds
    setTimeout(() => {
        flashMessages.forEach(message => {
            message.style.transition = "opacity 0.5s"; // Smooth fade-out
            message.style.opacity = "0"; // Make the message transparent
            setTimeout(() => message.remove(), 500); // Remove the message after fade-out
        });
    }, 1000); // 1 seconds
});

// Intercept the form submission
document.getElementById('add-to-cart-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Update the cart count
    const cartCountElement = document.getElementById('cart-count').querySelector('span');
    let currentCount = parseInt(cartCountElement.textContent, 10);
    cartCountElement.textContent = currentCount + 1;

    // Send the form data to the server
    const formData = new FormData(this); // 'this' refers to the form element
    fetch(this.action, {
        method: this.method,
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Parse the response
        })
        .then(data => {
            console.log('Server response:', data); // Log server response for debugging
            // Optionally display a flash message here if the server responds with success
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});

document.getElementById('add-to-cart-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Update the cart count
    const cartCountElement = document.getElementById('cart-count').querySelector('span');
    let currentCount = parseInt(cartCountElement.textContent, 10);
    cartCountElement.textContent = currentCount + 1;

    // Display flash message
    const flashMessages = document.getElementById("flash-messages");
    const flashMessage = document.createElement("div");
    flashMessage.className = "flash-message flash-success";
    flashMessage.textContent = "Cart updated successfully!";
    flashMessages.appendChild(flashMessage);

    // Remove flash message after 3 seconds
    setTimeout(() => {
        flashMessage.remove();
    }, 3000);
});
