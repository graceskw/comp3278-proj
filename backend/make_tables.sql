-- Create the 'users' table
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255)
);

-- Create the 'course' table
CREATE TABLE course (
    course_id INT PRIMARY KEY,
    name VARCHAR(255),
    site_link VARCHAR(255)
);

-- Create the 'enrollment' table
CREATE TABLE enrollment (
    user_id INT,
    course_id INT,
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (course_id) REFERENCES course(course_id)
);

-- Create the 'class' table
CREATE TABLE class (
    class_id INT PRIMARY KEY,
    course_id INT,
    location VARCHAR(255),
    message VARCHAR(255),
    zoom_link VARCHAR(255),
    start_time DATETIME,
    end_time DATETIME,
    FOREIGN KEY (course_id) REFERENCES course(course_id)
);

-- Create the 'session' table
CREATE TABLE session (
    session_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INT,
    login_time DATETIME,
    logout_time DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create the 'activity' table
CREATE TABLE activity (
    activity_id INT PRIMARY KEY,
    session_id INT,
    activity_type VARCHAR(255),
    time DATETIME,
    FOREIGN KEY (session_id) REFERENCES session(session_id)
);