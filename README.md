# Expresso

This is my personal project template for single page web applications on Nodejs running with Express and Mongo.
I've used this for a while to speed start some web project so it's better off here. 

## The Setup

This Structure/Template project works for RESTful API web applications in mind since it let's you setup RESTful and Custom endpoint with ease.

It also let's static files be served either by endpoint or on a public folder, just in case.


## Usage

- Config.json
Every important info used around the application should go here, the object is seperated into environments that you define (even thought it expects development as defuault), and according to the environment dictated on server the resulting config object will be available across the whole application.

- Server.js
Server.js is practically the "main" of the project itself, it basically just initialize everything needed by the Express + Mongo Application.

- app/
The app folder is the default folder for everything that will be needed on the frontend side of the application (Whatever framework used to power the frontend), it is placed here to maintain the brunch default order (since brunch is awesome and simple to use)

- server/
The server folder just holds everything needed by the server itself, from the controllers to the models schemas, its here just to separate backend from frontend properly

- server/config/routes.js
Define all your routes here in a Rails style; you can define route with handling function or 'Controller#Function' style handler; only the resource option(function) maps CRUD actions to a controllers based on the respectives model's name or if the controller/functions needed are missing map the CRUD actions to basic default managing functions.
You can also use 'ony' and 'except' array parameter to modify the generated resource endpoints.

- server/models/schema
Define all your database schema here, object by object, it accepts all restrictions and options for a Mongo database setup.

- server/controllers/
All your controllers for resources should be here, everyone of them should start with a capital letter and end with Controller or else the resource would not detect it
and the application will used a generic controller to handle the request.

- server/controllers/ApplicationController.js, server/config/router.js & server/models/models.js
Are files used by the application to setup.

## To Start
To Start the application after setting up all the required files you just need to:
```
npm install
bower install
brunch build
node server.js
```

### For Technologies

1. NodeJS
2. Express
3. MongoDB
4. Bower
5. Brunch

### Notice

Let me know if it is broken, create a pull request in that case. :)

### License

MIT