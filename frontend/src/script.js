// Get the video element
const video = document.getElementById('cameraFeed');

// Function to start the video when the user interacts with the page
function startVideo() {
  // Check if the browser supports accessing the user's camera
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Access the camera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        // Set the camera stream as the source of the video element
        video.srcObject = stream;
      })
      .catch(function (error) {
        console.error('Error accessing the camera: ', error);
      });
  } else {
    console.error('Browser does not support accessing the camera.');
  }
}

// Function to capture an image from the video stream
function captureImage() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Get the image data from the canvas as a base64 string
  const imageData = canvas.toDataURL().split(',')[1];

  // Send the captured image data to the backend
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: imageData })
  })
    .then(function (response) {
      // Handle the response from the backend
      // ...
    })
    .catch(function (error) {
      console.error('Error sending the image to the backend: ', error);
    });
}

// Add an event listener to start the video when the page is loaded
document.addEventListener('DOMContentLoaded', startVideo);

// Add an event listener to capture the image when the "Sign In" button is clicked
const signInButton = document.querySelector('.blue_btn');
signInButton.addEventListener('click', captureImage);