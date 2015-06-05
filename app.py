import os

from flask import Flask
from flask import render_template, request, send_from_directory, redirect, url_for,json, jsonify, Response
from werkzeug import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'upload/'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

@app.route('/')
def index():
    return render_template('index.html')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            url = '/uploads/'+filename
            ret = {'url': url}
            # url = url_for('uploaded_file', filename=filename)
            return json.dumps(ret)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0')