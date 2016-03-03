//Setup environment
config = require('./server/config/config.json');
environmentOptions = Object.keys(config);
ENV = 'development';
for(option in environmentOptions){
	if(process.argv.indexOf('-'+option) > -1){
		ENV = option;
		break;
	}
}
config = config[ENV];

//Setup server port
var port;
if(config.server.port)
	port = config.server.port;
else
	port = 8080;
portIndex = process.argv.indexOf('-p');
if(portIndex > -1)
	port = parseInt(process.argv[portIndex+1]); 

/*
 Load mandatory requirements
*/

// Common Libraries
path = require('path');
fs = require('fs');
crypto = require('crypto');

// Third parties
require('colors');
var bodyParser = require('body-parser'),
	compress = require('compression');
mongoose = require('mongoose');
express = require('express');

// Specific Import
var models = require('./server/models/models.js'),
	controller = require('./server/ApplicationController.js'),
	router = require('./server/config/router.js'),
	routes = require('./server/config/routes.js');

//Setup express app
App = express();
Router = {};
if(config.server.serveStatic)
	App.use( express.static(__dirname + config.server.serveStatic) )
App.use( compress() );
App.use( bodyParser.json() );

//Append user defined config to the application
App.__CONFIG = config;

models.init( (function(){
	controller.init();
	router.init();
	routes.routes();
}).bind(this) );

App.listen(port);
console.log(('Listening on Port '+port).green);