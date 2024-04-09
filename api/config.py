import os

UPLOAD_FOLDER = 'uploads'
TRANSLATIONS_FOLDER = 'translations'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'heif', 'hevc'}
username = 'seancanterbury'     #os.getenv("DB_USERNAME")
password = ''                   #os.getenv("DB_PASSWORD")
host = 'localhost'              #os.getenv("DB_HOST")
port = '5432'                   #os.getenv("DB_PORT")
dbname = 'ocrscribe_db'         #os.getenv("DB_NAME")
connection_string = f"postgresql://{username}@{host}:{port}/{dbname}"