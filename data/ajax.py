import time
from bottle import route, Bottle, jinja2_template

app = Bottle()

@app.route('/v1/')
def v1():
    return ''


@app.route('/v2/')
def v2():
    return ''


@app.route('/v3/')
def v3():
    time.sleep(2)
    return ''
