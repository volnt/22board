# 22board

22 board is an anonymous and public message board.

In order to post a message you just have to be authenticated.
In order to be authenticated you just have to solve a captcha.

# Authentication

The authentication tokens are stored in the localStorage so they survive
reboots.

At any point you can request new authentication tokens.

# Messages

Each message has karma and starts with a karma of zero. However, when created
a message is automatically upvoted by its author.

You can upvote a given message only once with an authentication token.

# Install

You can install the 22board package with `python setup.py install`.

I recommend heavily the use of a virtualenv.
