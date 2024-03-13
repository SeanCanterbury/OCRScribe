from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

# Make sure python interpreter is correct, also might need to only go into api as workspace for this to work