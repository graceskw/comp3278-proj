# Create a basic Flask app saying "Hello, world!"
from flask import Flask, render_template
from flask_session import Session
from tempfile import mkdtemp

app = Flask(__name__)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
app.config["TEMPLATES_AUTO_RELOAD"] = True


@app.route("/")
def index():
    # Return index.html
    data = "world"
    return render_template("index.html", data=data)