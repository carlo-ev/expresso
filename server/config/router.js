function defineHandler(handler){
	var controller;
	if(typeof handler == "function")
		return handler;
	else if(typeof handler == "string"){
		handler = handler.split('#');
		handler[0] = handler[0][0].toUpperCase() + handler[0].slice(1) + 'Controller.js';
		try{
			controller = require( path.resolve('./server/app/controllers/'+handler[0]) );
		}catch(error){
			controller = null;
		}
		if(controller && controller[handler[1]])
			return controller[handler[1]];
	}
	throw new Error('Unsupported Handler of type '+ typeof handler);
}
module.exports.init = function(){
	var resourceFunctions,
		prefix = '/', 
		_this = this;

	Router.root = root = function(handler){
		App.get('/', defineHandler(handler));
	};

	Router.get = get = function(route, middle, handler){ 
		App.get.apply(_this, arguments);
	};

	Router.put = put = function(route, middle, handler){ 
		App.put.apply(_this, arguments);
	};

	Router.post = post = function(route, middle, handler){ 
		App.post.apply(_this, arguments);
	};

	Router.destroy = destroy = function(route, middle, handler){
		App.destroy.apply(_this, arguments);
	};

	resourceFunctions = {
		index: function(baseRoute, manager){ 
			get.apply(_this, arguments);
		},
		create: function(baseRoute, manager){
			post.apply(_this, arguments);
		},
		show: function(baseRoute, manager){ 
			var showRoute;
			showRoute = '/:id';
			if(baseRoute.indexOf(':id') > -1)
				showRoute += (baseRoute+split(':id').length-1); 
			get(baseRoute+showRoute, manager);
		},
		update: function(baseRoute, manager){
			var showRoute;
			showRoute = '/:id'
			if(baseRoute.indexOf(':id') > -1)
				showRoute += (baseRoute.split(':id').length-1);
			put(baseRoute+showRoute, manager);
		},
		destroy: function(baseRoute, manager){
			var showRoute;
			showRoute = '/:id';
			if(baseRoute.indexOf(':id') > -1)
				showRoute += (baseRoute.split(':id').length-1);
		}
	};

	Router.resource = resource = function(){
		var route, resourceRoutes;
		route = arguments[0];
		resourceRoutes = ['index','create','show','update','destroy'];
		for(arg in arguments){
			if(typeof arg == 'object'){
				if(arg.only)
					resourceRoutes = arg.only;
				else if(arg.except)
					arg.except.forEach(function(rule){
						var ruleIndex;
						ruleIndex = resourceRoutes.indexOf(rule);
						if(ruleIndex > -1)
							resourceRoutes.splice(ruleIndex, 1);
					});
			}
			if(typeof arg  == 'function'){
				var oldPrefix;
				oldPrefix = prefix;
				prefix = route+prefix;
				arg();
				prefix = oldPrefix;
			}
		}
		resourceRoutes.forEach(function(rest){
			ApplicationController.bindController(route, rest, function(controllerFunction){
				resourceFunctions[rest](route, controllerFunction);
			});
		});
	};
}