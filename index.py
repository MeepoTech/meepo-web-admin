#!/usr/bin/env python

import web
import os
import json
import redis
import time
from config import *

render = web.template.render("templates")

urls = (
    '/',            'Login',
    '/upload',      'Upload',
    '/home',        'Home',
)

r = redis.StrictRedis(host=redis_addr)


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

        # save the file
        output = open(upload_dir + filename, 'w')
        output.write(form['myfile'].value)

        # store metadata
        redis_key = 'release:' + platform
        meta = {
            'platform': platform,
            'version': version,
            'filename': filename,
            'date': date,
            'adaptation': adaptation[platform],
            'size': str(round(os.path.getsize(upload_dir + filename)/1024/1024.0, 2)) + 'M'
        }

        r.hmset(redis_key, meta)
        if not r.hexists(redis_key, 'downloads'):
            r.hset(redis_key, 'downloads', 0)

        return 'success'


app = web.application(urls, globals())
application = app.wsgifunc()

if __name__ == "__main__":
        app.run()
