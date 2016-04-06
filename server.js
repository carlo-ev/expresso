//Setup environment
var config = require('./server/config/config.json');
var environmentOptions = Object.keys(config);
var ENV = 'development';
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
var portIndex = process.argv.indexOf('-p');
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
	plugger = require('./server/config/plugger.js'),
	routes = require('./server/config/routes.js');

//Setup express app
App = express();
Router = express.Router()
if(config.server.serveStatic)
	App.use( express.static(__dirname + config.server.serveStatic) )
App.use( compress() );
App.use( bodyParser.json() );
App.use( bodyParser.urlencoded({ extended: true }) );

//Append user defined config to the application
App.locals = config;

ApplicationController = require('./server/ApplicationController.js');

var methodColors = {
	'GET': 'cyan',
	'POST': 'blue',
	'PUT': 'blue',
	'DELETE': 'yellow'
};
var methodColorsOptions = Object.keys(methodColors);


models.init( (function(){
	plugger.init();
	routes.routes();

	App.use(function(req, res, next){
		var requestName, requestColor;
		requestName = 'New '+req.method+' request to '+req.path;
		requestColor = methodColorsOptions.indexOf(req.method)>-1 ? methodColors[req.method] : 'cyan';
		console.time(requestName[requestColor]);
		res.on('finish', function(){
			console.timeEnd(requestName[requestColor]);
		});
		next();
	});

	App.use(Router)
	App.listen(port);
	console.log(('Listening on Port '+port).green);
}).bind(this) );