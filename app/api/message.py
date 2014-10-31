from app import app, redis
from flask import jsonify, make_response, abort, request
from ast import literal_eval
import hashlib
from datetime import datetime
from auth import is_authenticated

DATE_FMT = "%Y-%m-%d %H:%M:%S.%f"

"""
 message:<id> -> str(json(object))
 messages     -> [set ids]
 karma:<id>   -> [set ids]
"""

class Message(object):
    def __init__(self, message, sha=None, karma=None, date=None):
        self.message = str(message)
        self.sha = hashlib.sha1(self.message).hexdigest() if sha is None else sha
        self.karma = 1 if karma is None else karma
        self.date = datetime.now() if date is None else datetime.strptime(date, DATE_FMT)

    @classmethod
    def from_json(cls, message):
        return cls(message["message"], sha=message["sha"], 
                   karma=message["karma"], date=message["date"])

    @classmethod
    def from_sha(cls, sha):
        if redis.sismember("messages", sha):
            return cls.from_json(literal_eval(redis.get("message:{}".format(sha))))
        else: 
            return None

    def to_dict(self):
        return {
            "message": self.message,
            "sha": self.sha,
            "karma": self.karma,
            "date": self.date.strftime(DATE_FMT)
        }

    def save(self):
        return (redis.sadd("messages", self.sha) and
                redis.set("message:{}".format(self.sha), self.to_dict()))

    def update(self):
        return (redis.sismember("messages", self.sha) and
                redis.set("message:{}".format(self.sha), self.to_dict()))

    def add_karma(self, sha):
        if redis.sadd("karma:{}".format(self.sha), sha):
            self.karma += 1
            return self.update()
        return False

@is_authenticated
@app.route('/api/message/<sha>/karma', methods=['POST'])
def add_karma(sha):
    message = Message.from_sha(sha)
    if message and message.add_karma(request.json.get("auth").get("sha")):
        return make_response(jsonify(message.to_dict()))
    else:
        return make_response(jsonify({"error": "Could not add karma to message."}), 400)

@is_authenticated
@app.route('/api/message', methods=['POST'])
def post_message():
    message = Message(request.json.get("message"))
    if message.save():
        return make_response(jsonify(message.to_dict()))
    else:
        return make_response(jsonify({"error": "Could not save message."}), 400)

@app.route('/api/message/<sha>')
def get_message(sha):
    message = Message.from_sha(sha)
    if message:
        return make_response(jsonify(message.to_dict()))
    else:
        return make_response(jsonify({"error": "Could not get message."}), 400)

@app.route('/api/message/lookup')
def message_lookup():
    if not request.args:
        return abort(400)
    shas = request.args.get("shas").split(',')
    messages = []
    for sha in shas:
        message = Message.from_sha(sha)
        if message:
            messages.append(message)
    return make_response(jsonify({message.sha: message.to_dict() for message in messages}))
    

@app.route('/api/messages')
def get_messages():
    messages = list(redis.smembers("messages"))
    return make_response(jsonify({
        "messages": messages
    }))
