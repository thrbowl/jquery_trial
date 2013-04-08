import os
from bottle import route, run, static_file, jinja2_template, default_app
import conf
import ajax


@route('/<filename:re:\w+.html>')
def static(filename):
    return static_file(filename, os.path.join(conf.ROOT, 'trial'))

@route('/static/<filepath:path>')
def static(filepath):
    return static_file(filepath, os.path.join(conf.ROOT, 'static'))

root = default_app.pop()
root.mount('/ajax/', ajax.app)

if __name__ == '__main__':
    run(app=root, host=conf.HOST, port=8080, reloader=True)