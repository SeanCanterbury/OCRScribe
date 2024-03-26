To activate the flask backend dev server from cloning the repo you first need to enter the following commands into the integrated terminal

1: cd api

2: python3 -m venv venv

3: source venv/bin/activate

4: pip install -r requirements.txt
(For installing requirements you may need to change your python interpreter in vs code by  shift + command + P, typing select python interpreter and choosing the right one for the project ONLY DO THIS IF YOU RUN INTO ISSUES WITH PIP INSTALL -R REQUIREMENTS.TXT)

5: flask run

IMPORTANT:
    IF YOU HAVE ALREADY DONE THESE STEPS IN YOUR CURRENT WORKSPACE AND ARE RETURNING TO WORK ON IT WITHOUT CLONING THE REPO YOU DO NOT NEED TO REINSTALL THE VENV JUST MAKE SURE YOU CD INTO THE API FOLDER, AND IF THE YOU ARENT IN THE VENV RUN COMMAND 3 AGAIN TO START IT. AFTER YOURE IN THE VENV ALL YOU NEED TO DO IS RUN FLASK RUN.

You wont beable to access the backend if the server is not runing and you need to restart the dev server if you make any changes by pressing control + C in the terminal and running flask run again.

CURRENT ENDPOINT DOCUMENTATION AS OF 03/26/24

To access the endpoints through your browser the default port is localhost:5000 but it might vary depending on your machine so reference the terminal when the server is running it will say Running on http://127.0.0.1:5000 but if yours is different its running on that.

there is currently no default endpoint so just visiting that url will give you an error so make sure you visit http://127.0.0.1:5000/upload or http://127.0.0.1:5000/translate 

upload allows you to upload files from your device to the backend in the uploads folder api/uploads  

translate lets you pick from the list of files in uploads and run the chosen file through the exsisting model.