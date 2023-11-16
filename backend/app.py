from flask import Flask, render_template, request, redirect, session, jsonify
from flask_session import Session
from tempfile import mkdtemp
import base64
import cv2
from cs50 import SQL
import numpy as np
import sqlite3
from datetime import datetime, timedelta
from flask_cors import CORS
from flask_mail import Mail, Message

db = SQL("sqlite:///data.db")

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

app = Flask(__name__)
CORS(app)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
app.config["TEMPLATES_AUTO_RELOAD"] = True

mail_settings = {
    "MAIL_SERVER": 'smtp.office365.com',
    "MAIL_PORT": 587,
    "MAIL_USE_TLS": True,
    "MAIL_USE_SSL": False,
    "MAIL_USERNAME": 'miscellaneous_acc@outlook.com',
    "MAIL_PASSWORD": 'comp3278',
    }
    
    # app = Flask(__name__)
app.config.update(mail_settings)
mail= Mail(app)

# @app.route("/")
# def index():
#     if len(session) > 0:
#         print("PRINTING SESSION")
#         print(session)
#         return redirect("/success")
#     return render_template("index.html")
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
        return str(user["user_id"])
    return redirect("/")

#It check whether the user have class which is within 1 hr. If so, return the course_id. Else, return No recent lectures
@app.route("/check_within1hr/<int:user_id>")
def check_1hr(user_id):
    # Get current time
    current_time = datetime.now()
    current_time_str = current_time.strftime("%H:%M:%S")

    # Calculate next hour's time
    next_hour = current_time + timedelta(hours=1)
    next_hour_str = next_hour.strftime("%H:%M:%S")

    weekday = (current_time.weekday()+1)%7

    conn = sqlite3.connect('main.db')
    c = conn.cursor()


    query = """
    SELECT e.course_id, c.class_type
    FROM enrollment e
    JOIN class c ON e.course_id = c.course_id
    WHERE e.user_id = ? 
    AND c.weekday = ? 
    AND (c.start_time BETWEEN ? AND ? OR ? BETWEEN c.start_time AND c.end_time);
    """
    print(current_time_str, next_hour_str)
    c.execute(query, (user_id, weekday, current_time_str, next_hour_str, current_time_str))

    result = c.fetchone()

    c.close()
    conn.close()

    if result:
        return (result[0], result[1])
    else:
        return 'N/A'

@app.route('/api/get_course_data/<int:user_id>', methods=['GET'])
def get_course_data(user_id):
    print("getting course data")
    next_course = check_1hr(user_id)
    db = {
        'upcomingCourse': 'N/A',
        'upcomingCourseTime': 'N/A',
        'upcomingCourseLocation': 'N/A',
        'teacherMessage': 'N/A',
        'general': 'N/A',
        'lectureNotes': 'N/A',
        'tutorialNotes': 'N/A',
        'otherMaterials': 'N/A'
    }
    if not next_course:
        return jsonify(db)
    else:
        conn = sqlite3.connect('main.db')
        c = conn.cursor()
        c.execute("""
        SELECT material_type, material_link
        FROM course_material
        WHERE course_id = ?
        """, (next_course[0],))
        rows = c.fetchall()
        c.close()
        conn.close()
        mat_type_conversion = ['teacherMessage','general','lectureNotes','tutorialNotes','otherMaterials']
        print("Rows" + str(rows))
        for row in rows:
            mat_type = row[0]
            mat_content = row[1]
            print("mat content" + str(mat_content))
            db[mat_type_conversion[mat_type]] = mat_content
        
        conn = sqlite3.connect('main.db')
        c = conn.cursor()

        c.execute("""
        SELECT location, start_time, end_time
        FROM class
        WHERE course_id = ? AND class_type = ?
        """, (next_course[0], next_course[1]))

        result = c.fetchone()
        if result:
            db['upcomingCourseLocation'] = result[0]
            db['upcomingCourseTime'] = str(result[1]) + " - " + str(result[2])
        
        c.execute("""
        SELECT name
        FROM course
        WHERE course_id = ?
        """, (next_course[0],))

        result = c.fetchone()
        c.close()
        conn.close()
        if result:
            db['upcomingCourse'] =  result[0]
        
        return jsonify(db)

@app.route("/course_info/<int:course_id>/<class_type>")
def get_materials(course_id, class_type):
    conn = sqlite3.connect('main.db')
    c = conn.cursor()
    c.execute("""
    SELECT material_type, material_link
    FROM course_material
    WHERE course_id = ?
    """, (course_id,))

    rows = c.fetchall()

    c.close()
    conn.close()

    course_info = {}
    for row in rows:
        mat_type = row[0]
        mat_link = row[1]
        if mat_type in course_info:
            course_info[mat_type].append(mat_link)
        else:
            course_info[mat_type] = [mat_link]
    
    conn = sqlite3.connect('main.db')
    c = conn.cursor()

    c.execute("""
    SELECT location, start_time, end_time
    FROM class
    WHERE course_id = ? AND class_type = ?
    """, (course_id, class_type))

    result = c.fetchone()

    if result:
        course_info['location'] = result[0]
        course_info['start_time'] = result[1]
        course_info['end_time'] = result[2]

    course_info['class_type'] = class_type


    query = """
    SELECT message, date
    FROM messages
    WHERE course_id = ?
    ORDER BY date ASC;
    """
    c.execute(query, (course_id,))    

    result = c.fetchall()
    if result:
        mess_arr = []
        for row in result:
            temp = [row[0], row[1]]
            mess_arr.append(temp)
        course_info['message'] = mess_arr
    
    c.execute("""
    SELECT name, zoom_link, teacher, course_code, course_brief
    FROM course
    WHERE course_id = ?
    """, (course_id,))

    result = c.fetchone()
    c.close()
    conn.close()
    if result:
        course_info['name'] =  result[0]
        course_info['zoom_link'] = result[1]
        course_info['teacher'] = result[2]
        course_info['course_code'] = result[3]
        course_info['course_brief'] = result[4]

    return course_info

#It return the array of dictionary where each dictionaryhave the key of ['course_id', 'course_code', 'class_type', 'weekday', 'start_time', 'end_time']
@app.route("/course_schedule/<int:user_id>")
def get_course_time(user_id):
    # Execute the query with parameter binding
    conn = sqlite3.connect('main.db')
    c = conn.cursor()

    query = "SELECT course_id FROM enrollment WHERE user_id = ?"
    c.execute(query, (user_id,))
    result = c.fetchall()
    course_id_arr = []
    if result:
        for row in result:
            course_id_arr.append(row[0])
    else:
        c.close()
        conn.close()
        return "No course"
    
    query = """
        SELECT c.course_id, c.course_code, cl.class_type, cl.weekday, cl.start_time, cl.end_time
        FROM course AS c
        JOIN class AS cl ON c.course_id = cl.course_id
        WHERE c.course_id IN ({})
    """.format(','.join(['?'] * len(course_id_arr)))

    c.execute(query, course_id_arr)

    # Fetch the results
    results = c.fetchall()

    keys = ['course_id', 'course_code', 'class_type', 'weekday', 'start_time', 'end_time']
    time_schedule = []

    # Iterate over the results and create a dictionary for each row
    for row in results:
        row_dict = dict(zip(keys, row))
        time_schedule.append(row_dict)

    # Return the time schedule array
    c.close()
    conn.close()
    return time_schedule
@app.route("/success", methods=["GET"])
def success():
    # Return success.html
    return "Success!"

@app.route("/sendEmail/<int:user_id>", methods=["GET"])
def sendEmail(user_id):
    msg = Message('Upcoming class reminder', sender = 'miscellaneous_acc@outlook.com', recipients = ['miscellaneous_acc@outlook.com'])
    result = check_1hr(user_id)
    if not result:
        msg.body = 'No upcoming class.'
    else:
        msg.body = str(get_materials(result[0], result[1]))
    # msg.body = str(get_materials(0,'lecture'))            # for testing
    mail.send(msg)
    
    return "Sent"

if __name__ == '__main__':
    app.run()