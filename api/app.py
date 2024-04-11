#interpreter/OCRScribe/api/venv/bin/python3

#flask imports
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from utils import auth_required, allowed_file
from flask_login import LoginManager, login_user, current_user, logout_user
import config

#OCR stuff
#import pandas as pd
#import tensorflow as tf
#import keras
#from keras.models import load_model
#import cv2
#import pytesseract
from model import run_ocr

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = config.connection_string
app.config['UPLOAD_FOLDER'] = config.UPLOAD_FOLDER
app.config['TRANSLATIONS_FOLDER'] = config.TRANSLATIONS_FOLDER
app.config['SECRET_KEY'] = config.SECRET_KEY

db = SQLAlchemy(app)
migrate = Migrate(app, db)

from models import User, Upload

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def loader_user(user_id):
    return User.query.get(user_id)

    
#testing database connection by creating a new upload entry and pushing it to db
@app.route('/', methods=['GET'])
def index():
    if current_user.is_authenticated:
        return f'Hello, {current_user.username}'
    else:
        return 'welcome to the api'
    

@app.route('/dbInit', methods=['GET'])
def db_init():
    db.create_all()
    return jsonify({'message': 'Database initialized'}), 200

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
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            if os.path.exists(file_path):
                # Generate a new filename by appending a number to the original filename
                count = 1
                while os.path.exists(file_path):
                    new_filename = f"{os.path.splitext(filename)[0]}_{count}{os.path.splitext(filename)[1]}"
                    file_path = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
                    count += 1
                filename = new_filename
            file.save(file_path)

            #saving metadata to database\
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            new_upload = Upload(user_id=current_user.id, file_name=filename, file_path=filepath)
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

#get for testing purposes only
@app.route('/signup', methods=['POST', 'GET'])
def signup():
    if request.method == "POST":
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")
        user = User(username=username, password=password, email=email)
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return jsonify({'message': 'User created successfully'}), 201
    return """
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sign Up</title>
    <style>
      h1 {
        color: green;
      }
    </style>
  </head>
  <body>
    <h1>Create an account</h1>
    <form action="#" method="post">
      <label for="username">Username:</label>
      <input type="text" name="username" />
      <label for="password">Password:</label>
      <input type="password" name="password" />
      <label for="email">Email:</label>
      <input type="email" name="email" />
      <button type="submit">Submit</button>
    </form>
  </body>
</html>
    """

@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == "POST":
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        print(username)
        print(password)
        
        user = User.query.filter_by(username=username).first()

        if user.password == password:
            login_user(user)
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'error': 'Invalid password'}), 401
    else:  # GET method
        return """
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login</title>
  <style>
      h1{
        color: green;
      }
  </style>
</head>
<body>
  <nav>
    <ul>
      <li><a href="/login">Login</a></li>
      <li><a href="/register">Create account</a></li>
    </ul>
  </nav>
  <h1>Login to your account</h1>
  <form id="loginForm" method="post">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" />
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" />
    <button type="button" onclick="submitForm()">Submit</button>
  </form>

  <script>
    function submitForm() {
      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;

      var data = {
        username: username,
        password: password
      };

      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Invalid username or password');
        }
        return response.json();
      })
      .then(data => {
        alert(data.message);
        // Handle successful login, redirect or other actions
      })
      .catch(error => {
        alert(error.message);
        // Handle error, display error message or other actions
      });
    }
  </script>
</body>
</html>
        """
    
@app.route('/signout', methods=['GET'])
def signout():
    logout_user()
    return jsonify({'message': 'Sign out successful'}), 200

@app.route('/user', methods=['GET'])
def get_user():
    if not current_user.is_authenticated:
        return jsonify({'error': 'User not authenticated'}), 401
    return jsonify({'username': current_user.username, 'email': current_user.email})


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
    uploads = Upload.query.filter_by(user_id=current_user.id).all()
    files = [upload.file_name for upload in uploads]
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
    data = request.get_json()
    filename = data.get('filename')
    print(data)
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
        os.system('rm -rf predict_detect/predict*')
        os.system('rm -rf ocr_job')
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

