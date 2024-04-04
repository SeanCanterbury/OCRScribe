#interpreter/OCRScribe/api/venv/bin/python3

#flask imports
from flask import Flask, request, jsonify, send_from_directory
#from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from flask_sqlalchemy import SQLAlchemy

#OCR stuff
import pandas as pd
import tensorflow as tf
import keras
from keras.models import load_model
import cv2
import pytesseract
from model import run_ocr

app = Flask(__name__)
#CORS(app)

#connecting to postgresql database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://seancanterbury@localhost/ocrscribe_db'
db = SQLAlchemy(app)

model = load_model('hand_machine_written.h5')

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'heif', 'hevc'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#model for user
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username
    
#creating the tables in the database
def create_tables():
    db.create_all()
    
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#testing database connection
@app.route('/', methods=['GET'])
def get_users():
    #create_tables() initializes the tables of the database if they do not exist need to move this to only run once
    #create_tables()
    #creating a new user
    #new_user = User(username='sean', email='swcanterbury7@gmail.com')
    #adding the new user to the database
    #db.session.add(new_user)
    #commiting the changes to the database
    #db.session.commit()
    #querying the database for all users
    users = User.query.all()
    #returning the usernames of all the users
    return jsonify([user.username for user in users])

@app.route('/upload', methods=['POST', 'GET'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in the request'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return jsonify({'message': 'File uploaded successfully'}), 200
        else:
            return jsonify({'error': 'Invalid file type.'}), 400
    # Render an HTML form for file upload
    return """
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    """


@app.route('/files', methods=['GET'])
def get_files():
    files = os.listdir(app.config['UPLOAD_FOLDER'])
    return jsonify({'files': files})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/helloworld', methods=['GET'])
def hello_world():
    return jsonify({'message': 'Hello, World!'})




@app.route('/translate', methods=['GET'])
def translate():
    # prompt user to select file to translate from upload folder
    files = os.listdir(app.config['UPLOAD_FOLDER'])
    if not files:
        return jsonify({'error': 'No files available in the uploads folder'}), 400

    #Render an HTML form for file selection
    html = """
    <!doctype html>
    <title>Select File</title>
    <h1>Select File</h1>
    <form method="POST" action="/translate">
      <select name="file">
    """
    for file in files:
        html += f'<option value="{file}">{file}</option>'
    html += """
      </select>
      <input type="submit" value="Translate">
    </form>
    """
    return html

@app.route('/translate', methods=['POST'])
def translate_post():
    # Get the selected file from the form data
    filename = request.form.get('file')
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400

    # Construct the image path
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    # Check if the image exists
    if not os.path.exists(image_path):
        return jsonify({'error': f"Image not found at {image_path}"}), 404

    # Run OCR on the image
    try:
        text = run_ocr(image_path)
    except Exception as e:
        return jsonify({'error': f"Error running OCR: {str(e)}"}), 500

    # May change to new folder for output
    translations_folder = os.path.join(os.path.dirname(app.config['UPLOAD_FOLDER']), 'translations')
    if not os.path.exists(translations_folder):
        os.makedirs(translations_folder)
    output_file_path = os.path.join(translations_folder, os.path.splitext(filename)[0] + ".txt")
    with open(output_file_path, 'w') as file:
        file.write(text)

    # Return the text as a JSON response
    return jsonify({'text': text})

if __name__ == '__main__':
    app.run(debug=True, ssl_context='adhoc')
    with app.app_context():
        create_tables()
    app.run(debug=True)

