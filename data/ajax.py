from bottle import route, Bottle, jinja2_template

app = Bottle()

@app.route('/complete/')
def ajax():
    return 'Ready? GO!!!'