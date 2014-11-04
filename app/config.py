from os import environ

AWS_ACCESS_KEY_ID = environ["AWS_ACCESS_KEY_ID"]
AWS_SECRET_ACCESS_KEY = environ["AWS_SECRET_ACCESS_KEY"]

BUCKET_NAME = "22board-captchas"
AWS_ROOT_URL = "https://s3-eu-west-1.amazonaws.com/{}/".format(BUCKET_NAME)
