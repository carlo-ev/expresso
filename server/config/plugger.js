var ControllersDirectory = fs.readdirSync( path.resolve('./server/controllers') );

function defineHandler(handler){
	if(!handler)
		return;
	var controller, controllerString;
	if(typeof handler == "function")
		return handler;
	else if(typeof handler == "string"){
		handler = handler.split('#');
		controllerString = handler[0][0].toUpperCase() + handler[0].slice(1) + 'Controller.js';
		
		if(ControllersDirectory.indexOf(controllerString)>-1){
			controller = require( path.resolve('./server/controllers/'+controllerString) );
		}else
			throw new Error('Mentioned controller '+controllerString+' in route handler '+handler.join('#'))
		if(controller[handler[1]])
			return controller[handler[1]];
		else
			throw new Error('Controller '+controllerString+' has no method '+handler[1]+' mentioned in route handler '+handler.join('#'));
	}
	throw new Error('Unsupported Handler of type '+ typeof handler);
}



module.exports.init = function(){
	var resourceFunctions,
		self = this;


	root = function(handler){
		Router.get('/', defineHandler(handler));
	};

	get = function(route, handler){
		Router.get(route, defineHandler(handler));
	}

	put = function(route, handler){
		Router.put(route, defineHandler(handler));
	}

	post = function(route, handler){
		Router.post(route, defineHandler(handler));
	}

	destroy = function(route, handler){
		Router.delete(route, defineHandler(handler));
	}

	resourceFunctions = {
		index: function(controller){
			Router.get('/'+controller.resource, controller.index);
		},
		create: function(controller){
			Router.post('/'+controller.resource, controller.create);
		},
		show: function(controller){ 
			var showRoute;
			showRoute = '/:id';
			if(controller.resource.indexOf(':id') > -1)
				showRoute += (conotroller.resource.split(':id').length-1); 
			Router.get('/'+controller.resource+showRoute, controller.show);
		},
		update: function(controller){
			var showRoute;
			showRoute = '/:id'
			if(controller.resource.indexOf(':id') > -1)
				showRoute += (controller.resource.split(':id').length-1);
			Router.put('/'+controller.resource+showRoute, controller.update);
		},
		destroy: function(controller){
			var showRoute;
			showRoute = '/:id';
			if(controller.resource.indexOf(':id') > -1)
				showRoute += (controller.resource.split(':id').length-1);
			Router.delete('/'+controller.resource+showRoute, controller.destroy)
		}
	};

	resource = function(route, options){
		var resourceRoutes, rest, resource, expectedControllerName, controller, baseController;
		resourceRoutes = ['index','create','show','update','destroy'];

		if(typeof options == 'object'){
			if(options.only)
				resourceRoutes = options.only;
			else if(options.except)
				for(rule in options.except){
					var ruleIndex = resourceRoutes.indexOf(rule);
					if(ruleIndex > -1)
						resourceRoutes.splice(ruleIndex, 1);
				}
		}else if (options instanceof Array){
			resourceRoutes = options
		}

		resource = route[0].toUpperCase()+route.slice(1);
		expectedControllerName = resource+'Controller.js';

		baseController = new ApplicationController(route);
		if(ControllersDirectory.indexOf(expectedControllerName)>-1){
			controller = require( path.resolve('./server/controllers/'+expectedControllerName) );
			controller.resource = route;
		}else{
			controller = baseController;
		}
		
		for(var i=0; i<resourceRoutes.length; i++){
			rest = resourceRoutes[i];

			resourceFunctions[rest]( controller.hasOwnProperty(rest) ? controller : baseController );
		}
	};
}