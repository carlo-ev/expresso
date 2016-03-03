var methodColors = {
	'GET': 'cyan',
	'POST': 'blue',
	'PUT': 'blue',
	'DELETE': 'yellow'
};
var methodColorsOptions = Object.keys(methodColors);

module.exports.init = function(){

	var ControllersDirectory = fs.readdirSync( path.resolve('./server/app/controllers') );
	
	App.use( function(req, res, next){
		var requestName, requestColor;
		requestName = 'New '+req.method+' request to '+req.path;
		requestColor = methodColorsOptions.indexOf(req.method)>-1 ? methodColors[req.method] : 'cyan';
		console.time(requestName[requestColor]);
		res.on('finish', function(){
			console.timeEnd(requestName[requestColor]);
		});
		next();
	});

	App.ApplicationController = ApplicationController = {
		bindController: function(route, method, callback){
			var resource, expectedControllerName, controller;
			resource = route[0].toUpperCase()+route.slice(1);
			expectedControllerName = resource+'Controller.js';
			if(ControllersDirectory.indexOf(expectedControllerName)>-1){
				controller = require( path.resolve('./server/app/controllers/'+expectedControllerName) );
				if(controller[method])
					callback(controller[method]);
				else
					ApplicationController[method](resource, callback);
			}else{
				ApplicationController[method](resource, callback);
			}
		},
		index: function(resource, callback){
			if(Models[resource]){
				callback(function(req, res){
					var search = {};
					if(req.query.filter && req.query.with)
						search[req.query.filter] = req.query.with;
					Models[resource].find(search, function(err, list){
						if(err)
							res.send([]);
						else{
							res.send( list.map( function(ele){
								var simple = ele.toObject();
								simple.creationDate = ele._id.getTimestamp();
								return simple;
							}));
						}
					});
				});
			}else{
				console.log('No Model found for resource: '+resource);
				callback(function(req, res){ 
					res.send([]);
				});
			}
		},
		create: function(resource, callback){
			if(Models[resource]){
				callback(function(req, res){
					Models[resource].create( req.body[resource], function(err, novel){
						if(err){
							err.success = false
							res.send(err);
						}else{
							resp = { success: true };
							resp[resource] = novel.toObject();
							resp[resource].creationDate = novel._id.getTimestamp();
							res.send(resp);
						}
					});
				});
			}else{
				console.log('No Model found for resource: '+resource);
				callback(function(req, res){
					res.send({ success: false, msg: 'No Model for the defined Resource' });
				});
			}
		},
		show: function(resource, callback){
			if(Models[resource]){
				callback(function(req, res){
					Models[resource].findOne({ _id: req.params.id }, function(err, one){
						if(err)
							one = {};
						else if(!one)
							res.status(404).end();
						else{
							var simple = one.toObject();
							simple.creationDate = one._id.getTimestamp();
							simple = one;
						}
						res.send(one);
					});
				});
			}else{
				console.log('No Model found for resource: '+resource);
				callback(function(req, res){
					res.send([]);
				});
			}
		},
		update: function(resource, callback){
			if(Models[resource]){
				callback(function(req, res){
					Models[resource].findOneAndUpdate({ _id: req.params.id }, req.body[resource], function(err, upd){
						if(err){
							err.success = false;
							res.send(err);
						}else if(!upd)
							res.status(404).end();
						else{
							var resp = {success: true};
							resp[resource] = upd.toObject().
							resp[resource].creationDate = upd._id.getTimestamp();
							res.send(resp);
						}
					});
				});
			}else{
				console.log('No Model found for resource: '+resource);
				callback(function(req, res){
					res.send({ success: false, msg: 'No Model for defined resource' });
				});
			}
		},
		destroy: function(resource, callback){
			if(Models[resource]){
				callback(function(req, res){
					Models[resource].findOne({ _id: req.params.id }, function(err, one){
						if(err){
							err.success = false;
							res.send(err);
						}else if(!one)
							res.status(404).end();
						else{
							res.send({ success: false });
						}
					});
				});
			}else{
				console.log('No Model found for resource: '+resource);
				callback(function(req, res){
					res.send({ success: true, msg: 'No Model for defined resource' });
				});
			}
		}
	};

};