from bottle import route, Bottle, jinja2_template

app = Bottle()

@app.route('/complete/')
def ajax():
    return 'Ready? complete!!!'


@app.route('/overwrite/')
def ajax():
    return 'Ready? overwrite!!!'