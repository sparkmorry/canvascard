import os

from flask import Flask
from flask import render_template, request, send_from_directory, redirect, url_for,json, jsonify, Response
from werkzeug import secure_filename
from base64 import decodestring
import time, random

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads/'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

@app.route('/')
def index():
    return render_template('index.html')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
    	imgData = request.form['imgData']
    	_, b64data = imgData.split(',') # [sic]
    	timeStamp = int(time.time())
    	randomNum = int(random.random()*1000)
    	filename = str(timeStamp)+str(randomNum)
    	fh = open("static/uploads/"+str(filename)+".jpg", "wb")
    	fh.write(decodestring(b64data))
    	fh.close()
        ret = {'url': '/static/uploads/'+filename+'.jpg'}
        return json.dumps(ret)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0')