from flask import request, jsonify, make_response, abort
from token import Token

def is_authenticated(f):
    def wrapped(*args, **kwargs):
        if not request.json:
            return abort(400)
        auth = request.json.get('auth')
        if not auth:
            return make_response(jsonify({'error': 'Authentication needed.'}), 400)
        if not Token.check_captcha(auth.get('sha'), auth.get('captcha')):
            return make_response(jsonify({'error': 'Authentication failed.'}), 400)
        return f(*args, **kwargs)
    return wrapped
