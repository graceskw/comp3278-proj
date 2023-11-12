// TODO: add back Nafis' wonderful moving background :)))))))
import React, {useEffect} from 'react'
import { CircularProgress } from '@mui/material' 
import Box from '@mui/material/Box';

export default function Login() {
    // Function to start the video when the user interacts with the page
    function startVideo() {
    // Check if the browser supports accessing the user's camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Access the camera
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            // Set the camera stream as the source of the video element
            video.srcObject = stream;
        })
        .catch(function(error) {
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

        // const [loginErr, setLoginErr] = React.useState(false);

        // Send the captured image data to the backend
        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData })
        })
        .then((response) => response.json()).then((responseJson) => {
            sessionStorage.setItem('user', responseJson);
            // later if there isnt any classes within 1 hr, redirect to timetable
            window.location.href = "/upcoming";
            document.querySelector('.loginErr').style.display = 'none';
        })
        
        .catch(function(error) {
        console.error('Error sending the image to the backend: ', error);
        document.querySelector('.loginErr').style.display = 'block';
        document.querySelector('.loginErr').style.color = 'red';
        document.querySelector('.image-holder').style.borderColor = 'red';
        // document.querySelector('.login_form_container').style.filter = 'blur(3px)'
        document.querySelector('.circularProgress').style.display = 'block';

        });
    }

    let video = null;
    let signInButton = null;
    useEffect(() => {
        if(sessionStorage.getItem('user')){
            window.location.href = "/upcoming";
        }
        if(document){
        // Get the video element
        video = document.getElementById('cameraFeed');
        // Add an event listener to start the video when the page is loaded
            startVideo();
        // Add an event listener to capture the image when the "Sign In" button is clicked
        signInButton = document.querySelector('.blue_btn');
        signInButton.addEventListener('click', captureImage);
        }
    }, [document])
    

    return (
        <div className="login_container">
        {/* <Box sx={{ display: 'block',}}>
            <CircularProgress className="circularProgress" size={400} style={{position:'relative', left:'50%'}}/>
        </Box> */}

        <div className="login_form_container">
            <div className="left">
                <div className="form_container">
                    <h1 className="padding_bottom">Login to Your Account</h1>
                    <div className="image-holder">
                        <video id="cameraFeed" autoPlay></video>
                    </div>
                    <button className="blue_btn">
                        Sign In
                    </button>
                    <p className='loginErr' style={{display:'none'}}>Login failed</p>
                </div>              
            </div>
        </div>
        <script src="./script.js"></script>
    </div>
    
  )
}
