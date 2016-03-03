module.exports.init = function(callback){
	var schema, uri, modelSchemas, Schema;
	
	schema = require('./schema.js').schema;

	//Database Connection URI
	uri = 'mongodb://'+ 
		App.__CONFIG.database.username + ':' +
		App.__CONFIG.database.password + '@' +
		App.__CONFIG.database.host + ':' +
		App.__CONFIG.database.port + '/' +
		App.__CONFIG.database.database;

	modelSchemas = Object.keys(schema);
	Schema = mongoose.Schema;
	mongoose.connect( uri, function(){ 
		console.log('Database Connected!');
		App.Models = Models = {};
		modelSchemas.forEach(function(def){
			var baseSchema = new Schema(schema[def].attrs);
			App.Models[def] = Models[def] = mongoose.model(def, baseSchema);
			for(helper in schema[def].helpers){
				App.Models[def][helper] = Models[def][helper] = schema[def].helpers[helper];
			}
		});
		callback();
	});
};
