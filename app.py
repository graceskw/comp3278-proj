from flask import Flask, render_template, request, redirect, session
from flask_session import Session
from tempfile import mkdtemp
import base64
import cv2
from cs50 import SQL
import numpy as np

db = SQL("sqlite:///data.db")

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

app = Flask(__name__)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
app.config["TEMPLATES_AUTO_RELOAD"] = True


@app.route("/")
def index():
    if len(session) > 0:
        print("PRINTING SESSION")
        print(session)
        return redirect("/success")
    return render_template("index.html")
@app.route("/login", methods=["POST"])
def login():
    # Print a message to the console
    print("Received an image")

    # Get the image from the request
    image = base64.b64decode(request.json.get("image"))

    # Get data from database
    users = db.execute("SELECT * FROM users")
    print(users)

    highest_confidence = 0  # Initialize highest confidence

    for user in users:
        yml_path = f"static/{user['user_id']}.yml"
        recognizer = cv2.face.LBPHFaceRecognizer_create()
        recognizer.read(yml_path)

        # Convert the image data to a numpy array
        nparr = np.frombuffer(image, np.uint8)

        # Decode the image array to an OpenCV image
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Convert the image to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Detect faces in the grayscale image
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        for (x, y, w, h) in faces:
            # Resize the face region to a fixed size
            resized_face = cv2.resize(gray[y:y+h, x:x+w], (200, 200))

            # Predict the label and confidence for the resized face
            label, confidence = recognizer.predict(resized_face)
            print("User:", user["user_id"], "Confidence:", confidence)

            if confidence > highest_confidence:
                highest_confidence = confidence  # Update highest confidence

    # Create session if highest confidence is greater than 40
    if highest_confidence > 40:
        session["user_id"] = user["user_id"]

    return redirect("/")

@app.route("/success", methods=["GET"])
def success():
    # Return success.html
    return "Success!"

if __name__ == '__main__':
    app.run()