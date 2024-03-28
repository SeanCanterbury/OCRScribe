#flask imports
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os

#OCR stuff
import pandas as pd
import tensorflow as tf
import keras
from keras.models import load_model
import cv2
import pytesseract

app = Flask(__name__)
CORS(app)

model = load_model('hand_machine_written.h5')

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'heif', 'hevc'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
    # Get the filename from the request data
    filename = request.json.get('filename')
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400

    # Construct the image path
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    # Load the image using OpenCV
    img = cv2.imread(image_path)

    # Check if the image was correctly loaded
    if img is None:
        return jsonify({'error': f"Image not found at {image_path}"}), 404

    # Convert the image to gray scale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Use Tesseract to do OCR on the image
    text = pytesseract.image_to_string(gray)
    print('Text', text)

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

