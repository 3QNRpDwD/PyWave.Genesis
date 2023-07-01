from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel, QPushButton
from PyQt6.QtCore import Qt
from .RequestHandler import Handler

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Server Dashboard")
        self.setGeometry(100, 100, 800, 600)
        
        label = QLabel("Welcome to Server Dashboard", self)
        label.setGeometry(100, 100, 200, 30)
        
        button = QPushButton("Click Me", self)
        button.clicked.connect(Handler().RunServer)
        button.setGeometry(100, 150, 100, 30)
        
        
        self.setCentralWidget(label)

class ServerDashboard:

    def run():
        app = QApplication([])
        window = MainWindow()
        window.show()
        app.exec()