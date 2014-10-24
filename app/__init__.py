__version__ = "0.1"

from flask import Flask
import redis

app = Flask(__name__)

redis = redis.Redis()

from app import views
from app.api import message, token
