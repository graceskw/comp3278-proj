# Create a basic Flask app saying "Hello, world!"

from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    # Return index.html
    data = "world"
    return render_template("index.html", data=data)