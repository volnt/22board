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
        captcha = Capytcha.generate()
        captcha.save()
        return cls(captcha.sha, captcha.url)

    @classmethod
    def from_sha(cls, sha):
        token = literal_eval(redis.get("token:{}".format(sha)))
        if token:
            return cls(**token)
        else: return None

    @staticmethod
    def check_captcha(sha, captcha):
        return redis.get("token:{}".format(sha)) and sha1(captcha).hexdigest() == sha

    def to_dict(self):
        return { "sha": self.sha, "captcha": self.captcha }

    def save(self):
        return (redis.sadd("tokens", self.sha) and
                redis.set("token:{}".format(self.sha), self.to_dict()))

@app.route('/api/token/request')
def token_request():
    token = Token.generate()
    if token.save():
        return make_response(jsonify(token.to_dict()))
    else:
        return make_response(jsonify({"error": "Could not create token."}), 400)

@app.route('/api/token/verify')
def token_verify():
    if not request.args:
        return abort(400)
    sha = request.args.get("sha")
    captcha = request.args.get("captcha")
    if Token.check_captcha(sha, captcha):
        return make_response(jsonify({"success": "Authentication success."}))
    else:
        return make_response(jsonify({"error": "Token could not be verified."}), 400)
