#!/usr/bin/env python

import web
import json
import os
import redis
import time
from web.contrib.template import render_jinja

upload_dir = '/home/ace/'
render = render_jinja("templates", encoding="utf-8")
platform_list = ['win32', 'win64', 'linux32', 'linux64', 'osx', 'android']

urls = (
    #'/',            'Index',
    '/upload',      'Upload',
)

r = redis.StrictRedis(host="0.meepotech.com")


def notfound():
    return web.notfound(render.notfound())


class Upload:
    def GET(self):
        return """<html><head></head><body>
            <form method="POST" enctype="multipart/form-data" action="">
            <input type="text" name="version" />
            <input type="text" name="platform" />
            <input type="file" name="myfile" />
            <br/>
            <input type="submit" />
            </form>
            </body></html>"""

    def POST(self):
        form = web.input(myfile={})
        platform = form['platform']
        version = form['version']
        filename = form['myfile'].filename
        if platform not in platform_list:
            return 'invalid platform type'
        date = time.strftime('%Y-%m-%d', time.localtime(time.time()))
        hash_key = 'release:' + platform
        r.hset(hash_key, 'version', version)
        r.hset(hash_key, 'date', date)
        r.hset(hash_key, 'filename', filename)
        output = open(upload_dir + filename, 'w')
        output.write(form['myfile'].value)

        return 'success'


app = web.application(urls, globals())
app.notfound = notfound
application = app.wsgifunc()

if __name__ == "__main__":
        app.run()
