#!/usr/bin/env python

import web
import json
import redis
import time

upload_dir = '/var/www/campus-website/upload'
render = web.template.render("templates")
platform_list = ['win32', 'win64', 'linux32', 'linux64', 'osx', 'android']

urls = (
    '/',            'Login',
    '/upload',      'Upload',
    '/home',        'Home',
)

r = redis.StrictRedis(host="0.meepotech.com")


class Login:
    def GET(self):
        return render.login()


class Home:
    def GET(self):
        return render.index()


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

        # ckeck platform
        platform = form['platform']
        if platform not in platform_list:
            return 'invalid platform type'

        # read metadata
        version = form['version']
        filename = form['myfile'].filename
        date = time.strftime('%Y-%m-%d', time.localtime(time.time()))
        redis_key = 'release:' + platform
        meta = {
            'version':   version,
            'filename':  filename,
            'date':      date
        }

        r.set(redis_key, json.dumps(meta))

        # save the file
        output = open(upload_dir + filename, 'w')
        output.write(form['myfile'].value)

        return 'success'


app = web.application(urls, globals())
application = app.wsgifunc()

if __name__ == "__main__":
        app.run()
