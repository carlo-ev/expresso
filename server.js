var ENV = "production";

if ( process.argv.indexOf('-dev') > -1 )
	ENV = "development";


var port;
if ( process.argv.indexOf('-p') > -1 )
	port = parseInt( process.argv[process.argv.indexOf('-p')+1] );


colors = require('colors');
mongoose = require('mongoose');
fs = require('fs');
bodyParser = require('body-parser');
compress = require('compression');
express = require('express');
app = express();


var config = require('./config.json')[ ENV ];
app.config = config;

if (!port)
	port = config.server.port;


app.use( express.static( __dirname + config.server.publicFolder ) );
app.use(compress()); 
app.use(bodyParser.json());

var models = require('./app/models/models.js')
,	controller = require('./app/controllers/ApplicationController.js')
,	router = require('./config/router.js')
,	routes = require('./config/routes.js');

var modelsInit = models.init
,	routerInit = router.init
,	controllerInit = controller.init
,	setRoutes = routes.routes;

modelsInit(function(){
	controllerInit();
	routerInit();
	setRoutes();
});

app.listen( port );
console.log( ('Listening on Port '+ port).green );