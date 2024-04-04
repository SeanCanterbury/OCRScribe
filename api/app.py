#interpreter/OCRScribe/api/venv/bin/python3


#flask imports
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
#OCR stuff
import pandas as pd
import tensorflow as tf
import keras
from keras.models import load_model
import cv2
import pytesseract
from model import run_ocr


app = Flask(__name__)


# Retrieve environment variables for database connection and secret key
username = 'seancanterbury'     #os.getenv("DB_USERNAME")
password = ''                   #os.getenv("DB_PASSWORD")
host = 'localhost'              #os.getenv("DB_HOST")
port = '5432'                   #os.getenv("DB_PORT")
dbname = 'ocrscribe_db'         #os.getenv("DB_NAME")

# Create a connection string for the PostgreSQL database
# with password connection_string = f"postgresql://{username}:{password}@{host}:{port}/{dbname}"
connection_string = f"postgresql://{username}@{host}:{port}/{dbname}"

#connecting to postgresql database
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://seancanterbury@localhost/ocrscribe_db'
app.config["SQLALCHEMY_DATABASE_URI"] = connection_string
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from models import User, Upload


#model = load_model('hand_machine_written.h5')

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'heif', 'hevc'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['TRANSLATIONS_FOLDER'] = 'translations'

global current_user
current_user = None

    
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/dbInit', methods=['GET'])
def db_init():
    db.create_all()
    return jsonify({'message': 'Database initialized'}), 200

#testing database connection by creating a new upload entry and pushing it to db
@app.route('/', methods=['GET'])
def get_users():
    new_upload = Upload(user_id=1, file_name='test.jpg', file_path='uploads/test.jpg')
    db.session.add(new_upload)
    db.session.commit()
    uploads = Upload.query.all()
    return jsonify([uploads.file_name for uploads in uploads])

#todo add user_id to the upload model
@app.route('/upload', methods=['POST', 'GET'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in the request'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        if file and allowed_file(file.filename):
            #saving file to uploads folder
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            #saving metadata to database\
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            new_upload = Upload(user_id=1, file_name=filename, file_path=filepath)
            db.session.add(new_upload)
            db.session.commit()

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

#remove GET access before production
@app.route('/delete/<filename>', methods=['GET','DELETE'])
def delete_file(filename):
    # Delete the file from the uploads folder
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(file_path):
        os.remove(file_path)
    else:
        return jsonify({'error': f"File not found at {file_path}"}), 404
    
    # Delete the corresponding translation file from the translations folder
    translation_file_path = os.path.join(app.config['TRANSLATIONS_FOLDER'], os.path.splitext(filename)[0] + ".txt")
    if os.path.exists(translation_file_path):
        os.remove(translation_file_path)
    
    # Delete the database entry
    upload = Upload.query.filter_by(file_name=filename).first()
    if upload:
        db.session.delete(upload)
        db.session.commit()
    
    return jsonify({'message': 'File deleted successfully'}), 200


#user endpoints

#create user through signup
@app.route('/signup', methods=['POST'])
def signup():
    if not request.json:
        return jsonify({'error': 'No input data provided'}), 400
    if 'username' in User.query.filter_by(username=request.json['username']).first() or 'email' in User.query.filter_by(email=request.json['email']).first():
        return jsonify({'error': 'Username already exists'}), 400
    else:
        new_user = User(username=request.json['username'], email=request.json['email'], password=request.json['password'])
        db.session.add(new_user)
        db.session.commit()
        global current_user 
        current_user = new_user
        return jsonify({'message': 'User created successfully'}), 201
    

@app.route('/login', methods=['POST'])
def login():
    if not request.json:
        return jsonify({'error': 'No input data provided'}), 400
    user = User.query.filter_by(username=request.json['username']).first()
    if not user or user.password != request.json['password']:
        return jsonify({'error': 'Invalid username or password'}), 400
    global current_user
    current_user = user
    return jsonify({'message': 'Login successful'}), 200


@app.route('/logout', methods=['GET'])
def logout():
    global current_user
    current_user = None
    return jsonify({'message': 'Logout successful'}), 200

#FOR DEV ONLY - DELETE BEFORE PRODUCTION
@app.route('/dbReset', methods=['GET'])
def db_reset():
    db.drop_all()
    db.create_all()
    admin = User(username='admin',password='admin',email='admin_email')
    db.session.add(admin)
    db.session.commit()
    files = os.listdir(app.config['UPLOAD_FOLDER'])
    for file in files:
        os.remove(os.path.join(app.config['UPLOAD_FOLDER'], file))

    trans = os.listdir(app.config['TRANSLATIONS_FOLDER'])
    for tran in trans:
        os.remove(os.path.join(app.config['TRANSLATIONS_FOLDER'], tran))
    return jsonify({'message': 'Database reset successfully'}), 200

#Will need to change so that it only returns files of the logged in user
@app.route('/files', methods=['GET'])
def get_files():
    files = os.listdir(app.config['UPLOAD_FOLDER'])
    return jsonify({'files': files})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

#testing only
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
    # Get the image path from the database
    upload = Upload.query.filter_by(file_name=filename).first()
    if not upload:
        return jsonify({'error': f"Image not found in the database"}), 404
    image_path = upload.file_path

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
        upload.text_extracted = output_file_path
        db.session.commit()
        

    # Return the text as a JSON response
    return jsonify({'text': text})

if __name__ == '__main__':
    app.run(debug=True, ssl_context='adhoc')
    with app.app_context():
        db.create_all()
    app.run(debug=True)

