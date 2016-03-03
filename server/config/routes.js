module.exports.routes = function(){
	root(function(req, res){
		var options;
		options = { root: __dirname };
		res.sendFile( path.resolve(App.__CONFIG.server.index), function(err){
			if(err){
				console.log('Error Sending Index'.red, err);
				res.status(err.status).end();
			}
		});
	});
}