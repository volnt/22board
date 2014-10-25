from app import app, redis
from flask import jsonify, make_response, abort, request, send_file
from ast import literal_eval
from datetime import datetime
from hashlib import sha1
from random import random
from app.capytcha import Capytcha

"""
 token:<id>     -> str(json(object))
 tokens         -> [list ids]
"""

class Token(object):
    def __init__(self, sha=None, captcha=None):
        self.sha = sha
        self.captcha = captcha

    @classmethod
    def generate(cls):
        sha = sha1(str(random())).hexdigest()
        captcha = Capytcha(sha1(str(random())).hexdigest()[:6])
        captcha.save("app/static/captcha/{}.jpeg".format(sha), position=(15, 0),
                     font={"filename":"app/static/fonts/MonospaceTypewriter.ttf",
                           "size": 20})
        return cls(sha, captcha.string)

    @classmethod
    def from_sha(cls, sha):
        token = literal_eval(redis.get("token:{}".format(sha)))
        if token:
            return cls(**token)
        else: return None

    @staticmethod
    def check_captcha(sha, captcha):
        token = redis.get("token:{}".format(sha))
        if not token: return False
        if not literal_eval(token)["captcha"] == captcha:
            return False # TODO : delete failed captcha
        return True

    def to_dict(self, public=True):
        if public:
            return { "sha": self.sha }
        else:
            return { "sha": self.sha, "captcha": self.captcha }

    def save(self):
        return (redis.sadd("tokens", self.sha) and
                redis.set("token:{}".format(self.sha), self.to_dict(public=False)))


@app.route('/api/token/request')
def token_request():
    token = Token.generate()
    if token.save():
        return make_response(jsonify(token.to_dict()))
    else:
        return make_response(jsonify({"error": "Could not create token."}), 400)

@app.route('/api/token/verify', methods=["POST"])
def token_verify():
    if not request.json:
        return abort(400)
    sha = request.json.get("sha")
    captcha = request.json.get("captcha")
    if Token.check_captcha(sha, captcha):
        return make_response(jsonify({"success": "Authentication success."}))
    else:
        return make_response(jsonify({"error": "Token could not be verified."}), 400)

@app.route('/api/token/<sha>.jpeg')
def get_captcha(sha):
    try:
        return send_file('static/captcha/{}.jpeg'.format(sha))
    except IOError:
        abort(404)

    
