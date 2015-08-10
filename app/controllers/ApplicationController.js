// THIS IS TOTALLY NECESSARY FOR EVERYTHING TO WORK DONT ERASE OR EARTH DIES
var methodColors = {
	'get': 'cyan',
	'post': 'blue',
	'put': 'blue',
	'delete': 'yellow'
};
var methodColorsOptions = Object.keys(methodColors);

module.exports.init = function(){

	var ControllersDirectory = fs.readdirSync('./');

	app.use(function(req, res, next){
		var requestName = "New " + req.method + ' request to ' + req.route;
		var requestColor = methodColors.indexOf(req.method) > -1 ? methodColors[req.method] : 'cyan';
		console.time(requestName[ requestColor ]);
		res.on('end', function(){
			console.timeEnd(requestName[ requestColor ]);
		});

		next();
	});

	ApplicationController = {

		bindController: function(route, method, callback){
			var resource =  route[0].toUpperCase() + route.slice(1);
			var expectedControllerName = resource + 'Controller.js';
			if ( ControllersDirectory.indexOf(expectedControllerName) > -1 ) {
				var controller = require('./'+expectedControllerName);
				if ( controller[method] ) {
					callback( controller[method] );
				}else{
					console.log( ('No method '+method+' on controller: '+expectedControllerName).gray );
					ApplicationController['basic'+method](resource, callback);
				}
			}else{
				ApplicationController['basic'+method](resource, callback);
			}
		},

		basicindex: function(resource, callback){
			if( Models[resource] ){
				callback(function(req, res){
					var search = {};
					if (req.query.filter && req.query.with)
						search[req.query.filter] = req.query.with;
					Models[resource].find(search, function(err, list){
						res.send( err ? [] : list );
					});
				});
			}else{
				console.log( ('No Model found for resource: ' + resource).gray );
				callback(function(req, res){
					res.send([]);
				});
			}
		},
		basiccreate: function(resource, callback){
			if ( Models[resource] ) {
				callback(function(req, res){
					Models[resource].create(req.body[resource], function(err, newOne){
						if (err) {
							err.success = false; res.send(err);
						}else{
							var resp = { success: true };
							resp[resource] = newOne.toObject();
							res.send(resp);
						}
					});
				});
			}else{
				console.log( ('No Model found for resource: ' + resource).gray );
				callback(function(req, res){
					res.send({ success: false, msg: "No Model for defined Resource" });
				});
			}
		},
		basicshow: function(resource, callback){
			if ( Models[resource] ) {
				callback(function(req, res){
					Models[resource].findOne({ _id: req.params.id }, function(err, one){
						res.send( err ? {} : one );
					});
				});
			}else{
				console.log( ('No Model found for resource: ' + resource).gray );
				callback(function(req, res){
					res.send({});
				});
			}
		},
		basicupdate: function(resource, callback){
			if ( Models[resource] ) {
				callback(function(req, res){
					Models[resource].findOneAndUpdate({ _id: req.params.id }, req.body[resource], function(err, upd){
						if (err) {
							err.success = false; res.send(err);
						}else{
							var resp = {success: true};
							resp[resource] = upd.toObject();
							res.send(resp);
						}
					});
				});
			}else{
				console.log( ('No Model found for resource: ' + resource).gray );
				callback(function(req, res){
					res.send({ success: false, msg: "No Model for defined Resource" });
				});
			}
		},
		basicdestroy: function(resource, callback){
			if ( Models[resource] ) {
				callback(function(req, res){
					Models[resource].findOne({ _id: req.params.id }, function(err, one){
						if (err) {
							err.success = false; res.send(err);
						}else if(!one){
							res.send({ success: false, msg: 'Document not found.'});
						}else{
							one.remove(function(err){
								if (err){
									err.success = false; res.send(err);
								}else
									res.send({ success: true });
							});
						}
					});
				});
			}else{
				console.log( ('No Model found for resource: ' + resource).gray );
				callback(function(req, res){
					res.send({ success: false, msg: "No Model for defined Resource" });
				});
			}
		}
	}

}