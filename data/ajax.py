import time
from bottle import route, Bottle, jinja2_template, response, get, post, request

app = Bottle()

@app.route('/v1/')
def v1():
    time.sleep(30)
    return 'hello v1'


@app.route('/v2/')
def v2():
    return 'hello v2'


@app.get('/v3/')
def v3():
    print dict(request.query)
    return 'hello v3'


@app.post('/v3/')
def v3():
    print request.POST.items()
    return 'hello v3'