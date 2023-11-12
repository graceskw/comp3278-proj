import sys
import cv2
import numpy as np
from PyQt5.QtWidgets import QApplication, QMainWindow, QLabel, QPushButton
from PyQt5.QtGui import QImage, QPixmap, QPainter, QBrush, QColor, QFont
from PyQt5.QtCore import Qt, QTimer

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
        self.detect_button = QPushButton(self)
        self.detect_button.setFixedSize(100, 50)
        self.detect_button.setStyleSheet("background-color: red; border-radius: 25px;")
        self.detect_button.move((self.width() - self.detect_button.width()) // 2, self.height() - self.detect_button.height() - 20)
        self.detect_button.setText("Detect Face")
        self.detect_button.setFont(QFont("Arial", 12))
        self.detect_button.clicked.connect(self.detect)

        self.recognizer = cv2.face.LBPHFaceRecognizer_create()
        self.recognizer.read("data.yml")
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

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
        painter.drawRoundedRect((self.width() - self.detect_button.width()) // 2, self.height() - self.detect_button.height() - 20, self.detect_button.width(), self.detect_button.height(), 25, 25)

    def detect(self):
        ret, frame = self.cap.read()
        if ret:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
            if len(faces) == 0:
                print("Fail")
            else:
                for (x, y, w, h) in faces:
                    face = gray[y:y+h, x:x+w]
                    label, confidence = self.recognizer.predict(face)
                    print(confidence)
                    if confidence > 20:
                        print("Success")
                    else:
                        print("Fail")

    def closeEvent(self, event):
        self.cap.release()
        super().closeEvent(event)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())