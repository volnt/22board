from config import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BUCKET_NAME, AWS_ROOT_URL
from PIL import Image, ImageDraw, ImageFont
from boto.s3.connection import S3Connection
from boto.s3.key import Key
from hashlib import sha1
from random import random

class Capytcha(object):
    def __init__(self, sha, path, url=None):
        self.sha = sha
        self.path = path
        self.url = url

    @classmethod
    def generate(cls):
        private_key = sha1(str(random())).hexdigest()[:8]
        public_key  = sha1(private_key).hexdigest()

        captcha = cls.create_captcha(public_key, private_key)
        return cls(public_key, captcha)
    
    @staticmethod
    def create_captcha(public_key, private_key):
        font = ImageFont.truetype(filename="app/static/css/fonts/CaviarDreams.ttf", size=20)
        image = Image.new('RGB', (100, 25), (255, 255, 255))
        text = ImageDraw.Draw(image)
        output = "app/static/captcha/{}.jpeg".format(public_key)
        
        text.text((0, 0), private_key, font=font, fill=(0, 0, 0))
        image.save(output)
        return output
    
    def save(self):
        conn = S3Connection(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
        bucket = conn.get_bucket(BUCKET_NAME)
        key = Key(bucket)

        key.key = self.sha + ".jpeg"
        if key.set_contents_from_filename(self.path) > 0:
            self.url = AWS_ROOT_URL + self.sha + ".jpeg"
