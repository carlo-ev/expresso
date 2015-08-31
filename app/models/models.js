module.exports.init = function(next){

	var schema = require('./schema.js').schema;

	// Database Connection Uri
	var uri = "mongodb://" + app.config.database.host + ":" + app.config.database.port + "/" + app.config.database.database;
	
	var global = this;

	var modelSchemas = Object.keys(schema);
	
	mongoose.connect( uri, function(){
		console.log('Database Connected...'.gray);
		global.Models = {};
		var modelSchemas = Object.keys(schema);
		console.log('Defining Models...'.gray);
		modelSchemas.forEach(function(def){
			Models[def] = mongoose.model( def, new mongoose.Schema(schema[def].attrs) );
		});
		next.bind(global);
		next();
	} );

};