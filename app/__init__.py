__version__ = "0.1"

from flask import Flask

app = Flask(__name__)

from app import views
from app.api import message
