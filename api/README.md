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

IMPORTANT ******* UPDATE
    I have successfully accessed the api from the frontend in the Files.js file. just to print to console as proof of concept and this is what ive learned.

    When running flask dev server you need to run it with the following command
    flask run --host=0.0.0.0 --port=5001

    this will allow the server to run on your devices ip address. This as far as i can tell is the only way to get this to work for testing purposes. For some reason because the react native runs our dev server on expo go it cannot access the api from the localhost address. because of this you will need to run it off of your devices ip address. 

    since this is running on your computers ip address that means anyone with the ip can access it so its important to not leave the server running or your device could be exposed. (Not ideal but this is the only way i could get it to work)

    For security reasons try to remember to manually remove your ip address from the frontend code and replace it with a placeholder that will throw an error (to remind whoever is working to swap it out with their own ip address) I have changed the ip address to YOUR-IP if you want to just ctrl + f and replace it in the Files.js


