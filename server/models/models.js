module.exports.init = function(callback){
	var schema, uri, modelSchemas, Schema;
	
	schema = require('./schema.js').schema;

	//Database Connection URI
	uri = 'mongodb://'+ 
		App.locals.database.username + ':' +
		App.locals.database.password + '@' +
		App.locals.database.host + ':' +
		App.locals.database.port + '/' +
		App.locals.database.database;

	console.log('database uri ', uri);
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
