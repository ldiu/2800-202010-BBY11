
## Project Title: Twenty Four (24)

* [Project Description] (#project-description)
* [Technologies] (#technologies)
* [Files] (#files)
* [Installation] (#installation)
* [Features] (#features)
* [Credits] (#credits)
* [Contact] (#contact)


## Project Description
Our team, MILC, is developing an arithmetic puzzle game to help children, seniors and anyone in between, exercise their brains and stay socially connected to their families and friends.


## Technologies
    Database: Mongodb Community (ver. 5.0.8), mongoose (ver. 6.0.0), mongoAtlas
    Backend: Node js (ver. 16.15.0), express (ver. 4.18.1), express-session (ver. 1.17.1), body-parser(ver 1.20.0), multer (ver 1.4.4), jsdom (19.0.0), Javascript, Jquery (ver. 3.6.0).
    Frontend: HTML, CSS.

## Files
File Contents of folder 2800-202210-BBY11:

├── node_modules
├── public
│   ├── css
│   │   ├── aboutUs.css
│   │   ├── adminDash.css
│   │   ├── editPost.css
│   │   ├── errorRedirect.css
│   │   ├── index.css
│   │   ├── login.css
│   │   ├── navbarFooter.css
│   │   ├── passRecov.css
│   │   ├── signUp.css
│   │   ├── timeline.css
│   │   └── userProfilePage.css
│   ├── fonts
│   │   └── Montserrat-Regular.ttf
│   ├── img
│   │   ├── andromeda_galaxy.png
│   │   ├── favicon.png
│   │   ├── game.jpg
│   │   ├── johndoe.png
│   │   ├── logo.png
│   │   ├── math2.png
│   │   ├── MILCyway.jpg
│   │   └── noImageUploaded.jpg
│   ├── js
│   │   ├── client.js
│   │   ├── footer.js
│   │   ├── gameBoard.js
│   │   ├── surpriseEvent.js
│   │   ├── userInformation.js
│   │   └── userProfilePage.js
│   ├── sounds
│   │   └── spaceSound.mp3
│   └── text
│       └── footer.html
├── .gitignore
├── about.html
├── adminDash.html
├── app.js
├── data.json
├── errorRedirect.html
├── index.html
├── index2.html
├── login.html
├── package-lock.json
├── package.json
├── passRecov.html
├── Profile
├── readme.txt
├── reference.txt.html
├── search.html
├── signUp.html
└── userProfilePage.html

## Installation
For Windows, install the latest version of:
a. Visual Studio Code or another IDE
	https://code.visualstudio.com/download
b. node.js and npm
	https://nodejs.org/en/download/
c. express
	In the Command line of your working directory, type:
		$ npm init
	Select return to accept the defaults except for the entry point:
		entry point: (app.js)
	Then install Express
		$ npm install express
d. multer 
	In the working directory command line:
		$ npm install --save multer
e. MongoDB Enterprise Edition
	https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/
f. mongoose
	In the command line of the working directory:
		$ npm install mongoose
g. express-session (must have node.js)
	In the terminal of your working directory, type:
		$ npm install express-session
h. body-parser (must have node.js)
	In the terminal of your working directory, type:
		$ npm install body-parser
i. jsdom(must have node.js)
	In the terminal of your working directory, type:
		$ npm install jsdom

For Mac, install the latest version of:
a. Visual Studio Code or another IDE
	https://code.visualstudio.com/download
b. node.js and npm
	https://nodejs.org/en/download/
c. express (must have node.js)
	In the terminal of your working directory, type:
		$ npm init
	Select return to accept the defaults except for the entry point:
		entry point: (app.js)
	Then install Express
		$ npm install express
d. multer (must have node.js)
	In the terminal of the working directory:
		$ npm install --save multer
e. MongoDB Community Edition
		https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/
f. mongoose (must have node.js)
	In the terminal of the working directory:	
		$ npm install mongoose
g. express-session (must have node.js)
	In the command line of your working directory, type:
		$ npm install express-session
h. body-parser (must have node.js)
	In the command line of your working directory, type:
		$ npm install body-parser
i. jsdom (must have node.js)
	In the command line of your working directory, type:
		$ npm install jsdom

Run the program:
- begin mongodb
- in the terminal/command line type: 
	$ node app.js

Testing Log: https://docs.google.com/spreadsheets/d/1OXmZg6fe_9uqS6ym4fp-ICmuPGuAmDl-oFU5m5WqekE/edit#gid=0

## Features
a. Create User
	- from index, click "login"
	- page redirects to login page, where user will select sign-up
	- page redirects to create an account page, where the user will fill in their Information
	- user selects "create account" button, and account is created
b. Login
	- from ndex, click "login"
	- enter valid credentials, either for an admin or a regular user
	- page will redirect to admin dashboard, if admin, or return to te index, if a regular user
c. Edit User Profile
	- be logged in
	- select the "profile" button in the "menu" dropdown
	- page will redirect to the profile page, where the user can select the "edit" button
	- this will open the user information fields to be edited
	- clicking "save" will save the information
d. Add Posts to Timeline
	- be logged in
	- select the "profile" button in the "menu" dropdown
	- page will redirect to the profile page, where the user can scroll down ot the timeline section
	- the user can type information down in the text box, and/or upload an image
	- clicking "submit" will save the timeline post
e. Edit/Delete Posts on Timeline
	- be logged in
	- select the "profile" button in the "menu" dropdown
	- page will redirect to the profile page, where the user can scroll down ot the timeline section
	- each post will have an edit button next to the date it was posted
	- clicking the edit button will open a pop-up window, where the user can edit text or the image
	- clicking "submit" will save the information
	- clicking "delete" will delete the entire post
f. Edit/delete User from Database
	- be logged in as an admin
	- be on the adminDash.html page
	- search for a user in the database by entering their email in the text box and clicking "search"
	- enter new user data in the form below the serach, then click "update" to save
	- click the delete button to delete the user from the database
g. Add User to Database
	- be logged in as an admin
	- scroll to the bottom of the adminDash.html page
	- enter new account information in the text boxes and check yes or no for admin
	- click to submit the new information to the datbase
h. Easter Egg Surprise
	- on the index page, click the "24" logo
	- the background will change and a sound will play
i. The game
	- press number buttons and arithmetic function buttons to maek the number 24
	- each number can onnly be used once

## Credits

Coding References: 

	References for code from course material examples: 
		- For printing DB on screen: Assignment 5 1537
		- For loading images to img folder: COMP 2537 examples "index.html - upload-file", "upload-app.js"
		- For fetching data: COMP 2537 example "index.html-fetch example".
		- For loading the footer: COMP 1800 coursework.
		- For creating the update function: COMP 1800 coursework, "demo 10"
	
	References for code from other resources: 	
		- For Sign Up: https://stackoverflow.com/questions/51820482/how-to-add-newuser-in-mongoose-data-base-in-node-js
		- Display image name when uploading: https://stackoverflow.com/questions/41542845/how-to-display-file-name-for-custom-styled-input-file-using-jquery
		- Validates an email: https://www.codegrepper.com/code-examples/javascript/javascript+check+email+format
  	- Checks if string is empty or all spaces: https://bobbyhadz.com/blog/javascript-check-if-string-contains-only-spaces
  	- Surprise event: https://www.w3schools.com/js/js_timing.asp
		- Accessing embedded array in mongodb: https://www.mongodb.com/community/forums/t/updating-an-object-in-an-array/16191/2

Photos References:
	- noImageUploaded: https://stock.adobe.com/ca/search?k=%22gallery+icon%22 
	- pencil html code: https://ogmeta.ru/en/symbols/pencils 
	- andromeda_galaxy.png: https://wallpaperaccess.com/andromeda-galaxy-4k
	- MILCyway.jpg: https://unsplash.com/photos/VdfCq4Uu5As
	- math2.png: https://www.theparisreview.org/blog/2019/07/22/the-aesthetic-beauty-of-math/
	- johndoe.png: https://nupem.ufrj.br/tecnicos/

## Contact
iliya
email: eliyahabibi2002@gmail.com
ihabibi1@my.bcit.ca

Liana
email: ldiu@my.bcit.ca

Colin
email: colin.lph.lam@gmail.com

Michaela
email: mmashlee@gmail.com 

 

