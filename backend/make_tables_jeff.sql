-- Create the 'users' table
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255)
);

-- Create the 'course' table
CREATE TABLE course (
    course_id INT PRIMARY KEY,
    course_code VARCHAR(25),
    name VARCHAR(255),
    zoom_link VARCHAR(255),
    teacher VARCHAR(255),
    course_brief VARCHAR(500)
    -- site_link VARCHAR(255)
);


-- Create the 'course material' table
CREATE TABLE course_material(
    material_id INT PRIMARY KEY,
    course_id INT,
    material_type VARCHAR(255), --assignments/lecture notes/ tutorial notes/ quiz/ midterm
    material_link VARCHAR(255),
    FOREIGN KEY (course_id) REFERENCES course(course_id)
)

CREATE TABLE messages(
    message_id INT PRIMARY KEY,
    course_id INT,
    message VAR(256),
    date VAR(20)
)

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
    -- class_id INT PRIMARY KEY,
    course_id INT,
    class_type VARCHAR(255), --tutorial or lecture
    location VARCHAR(255),
    weekday INT,
    start_time DATETIME,
    end_time DATETIME,
    PRIMARY KEY (course_id, class_type)
    FOREIGN KEY (course_id) REFERENCES course(course_id)
);

-- Create the 'session' table
CREATE TABLE session (
    session_id INT PRIMARY KEY,
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