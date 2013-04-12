import time
from bottle import route, Bottle, jinja2_template

app = Bottle()

@app.route('/v1/')
def ajax():
    return ''


@app.route('/v2/')
def ajax():
    return ''


@app.route('/v3/')
def ajax():
    time.sleep(2)
    return ''
