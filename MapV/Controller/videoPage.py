from flask import Blueprint
from flask import render_template, request
import json
from Dao.sqlDao import db
import hashlib
import re
from flask import Response
from werkzeug.http import Headers

videoPage = Blueprint('videoPage', __name__)


@videoPage.route('/video')
def hello_world():
    return render_template('video.html')


@videoPage.route('/part_to_full')
def part_to_full():
    range_header = request.headers.get('Range', None)
    if range_header:
        match = re.search(r'bytes=(\d+)-\d*', range_header)
        sk = int(match.group(1))
    else:
        sk = 0

    with open(".\\video\\biubiu.mp4", 'rb') as fr:
        fr.seek(0, 2)
        total = fr.tell()
        fr.seek(sk)
        chunk = fr.read(1024 * 1024 * 2)
        end = sk + len(chunk) - 1
        headers = Headers()
        headers.add('Accept-Ranges', 'bytes')
        headers.add('Content-Type', 'application/octet-stream')
        headers.add('Content-Range', 'bytes {}-{}/{}'.format(sk, end, total))
        return Response(chunk, 206, headers=headers)


