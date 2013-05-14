# -*- coding: utf-8 -*-
import contextlib
import urllib, urllib2

def post(url, data):
    data = urllib.urlencode(data)
    with contextlib.closing(urllib2.urlopen(url, data, timeout=2)) as f:
        print f.read()




if __name__ == '__main__':
    post('http://192.168.1.102:8080/ajax/v3/', {'a':1, 'b':2})