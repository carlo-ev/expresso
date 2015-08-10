# Expresso

Personal template for Nodejs + Express + Mongo projects.
I've used this for a while to speed start some web project so it's better of here. 

## The Setup

This Structure/Template project works for RESTful API web applications in mind since it let's you setup RESTful and Custom endpoint with ease.

It also let's static files either by endpoint or on a public folder, just in case.



## Usage

- Config.json
Every important info used around the application should go here, the object is seperated into 2 environments, development and production,
and according to the environment dictated on server the resulting object will be available across the whole application.

- Server.js
Server "main" it's pretty simple so just read it.

- config/Routes.js
Define all your routes here in a Rails style way but defining the handling function, only resource maps a basic function or the respective controller automtically right now.
You can also use 'ony' and 'except' array parameter to modify the generated resource endpoints.

- app/models/schema
Define all your database schema here, object by object, it accepts all restrictions and options for a Mongo database setup.

- app/controllers/ * + Controller.js
All your controllers for resources should be here, everyone of them should start with a capital letter and end with controller or else the resource would not detect it
and the application will used a generic controller to handle the request.

- app/controllers/ApplicationController.js - config/router.s - app/models/models.js 
Are files used by the application to setup.

### For Technologies

1. NodeJS
2. Express
3. MongoDB


### Notice

Let me know if it is broken, create a pull request in that case. :)

### License

MIT