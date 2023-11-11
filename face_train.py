import sys
import cv2
import numpy as np
from cs50 import SQL
from PyQt5.QtWidgets import QApplication, QMainWindow, QLabel, QPushButton
from PyQt5.QtGui import QImage, QPixmap, QPainter, QBrush, QColor, QFont
from PyQt5.QtCore import Qt, QTimer

db = SQL("sqlite:///data.db")

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.camera_label = QLabel(self)
        self.camera_label.setAlignment(Qt.AlignCenter)
        self.setCentralWidget(self.camera_label)
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_camera_feed)
        self.cap = cv2.VideoCapture(0)
        self.setFixedSize(800, 800)
        self.timer.start(30)
        self.train_button = QPushButton(self)
        self.train_button.setFixedSize(100, 50)
        self.train_button.setStyleSheet("background-color: red; border-radius: 25px;")
        self.train_button.move((self.width() - self.train_button.width()) // 2, self.height() - self.train_button.height() - 20)
        self.train_button.setText("Train")
        self.train_button.setFont(QFont("Arial", 12))
        self.train_button.clicked.connect(self.train)

        self.images = []  # List to store registered images
        self.target_num_images = 10  # Target number of images for training

        self.user_schema = [
            ('user_id', 'INT PRIMARY KEY'),
            ('name', 'VARCHAR(255)'),
            ('email', 'VARCHAR(255)')
        ]

    def update_camera_feed(self):
        ret, frame = self.cap.read()
        if ret:
            frame_height, frame_width, _ = frame.shape
            scale_factor = min(self.width() / frame_width, self.height() / frame_height)
            frame_resized = cv2.resize(frame, None, fx=scale_factor, fy=scale_factor, interpolation=cv2.INTER_LINEAR)
            frame_rgb = cv2.cvtColor(frame_resized, cv2.COLOR_BGR2RGB)
            image = QImage(frame_rgb, frame_rgb.shape[1], frame_rgb.shape[0], QImage.Format_RGB888)
            pixmap = QPixmap.fromImage(image)
            self.camera_label.setPixmap(pixmap)
            self.camera_label.adjustSize()

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setBrush(QBrush(Qt.red))
        painter.setPen(Qt.red)
        painter.drawRoundedRect((self.width() - self.train_button.width()) // 2, self.height() - self.train_button.height() - 20, self.train_button.width(), self.train_button.height(), 25, 25)

    def train(self):
        self.images = []  # Clear the previously registered images
        count = 0
        while count < self.target_num_images:
            ret, frame = self.cap.read()
            if ret:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
                faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
                for (x, y, w, h) in faces:
                    face = gray[y:y+h, x:x+w]
                    self.images.append(face)  # Add the registered face to the list
                    count += 1
                    cv2.putText(frame, f"Captured: {count}/{self.target_num_images}", (30, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                    cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                cv2.imshow("Training", frame)
            if cv2.waitKey(1) == ord('q') or count >= self.target_num_images:
                break

        if len(self.images) > 0:
            # Get the last user id from the database
            rows = db.execute("SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1")
            print(rows)
            if len(rows) == 0:
                last_user_id = 0
            else:
                last_user_id = rows[0]['user_id']
            user_id = last_user_id + 1
            user_name = user_id + 1
            user_email = f"{user_id}@mail.com"
            recognizer = cv2.face.LBPHFaceRecognizer_create()
            labels = np.zeros(len(self.images), dtype=int)

            # Train the face recognition model with the registered faces
            recognizer.train(self.images, labels)
            recognizer.save(f"static/{last_user_id + 1}.yml")
            # Insert the user into the database
            db.execute("INSERT INTO users (user_id, name, email) VALUES (?, ?, ?)", user_id, user_name, user_email)
            print("Model trained and saved successfully!")
        else:
            print("No images captured for training!")

    def closeEvent(self, event):
        self.cap.release()
        super().closeEvent(event)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())