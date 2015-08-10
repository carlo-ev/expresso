module.exports.init = function(){

	//This kind of resource over resource shit its kinda complicated 
	//and not working right now.... i think
	prefix = '/';


	get = function(route, handler){
		app.get(prefix + route, handler);
	}

	put = function(route, handler){
		app.put(prefix + route, handler);
	}

	post = function(route, handler){
		app.post(prefix + route, handler);
	}

	destroy = function(route, handler){
		app.delete(prefix + route, handler);
	}

	var resourceFunctions = {
		index: function(baseRoute, manager){
			get( baseRoute, manager );
		},
		create: function(baseRoute, manager){
			post( baseRoute, manager );
		},
		show: function(baseRoute, manager){
			var showRoute = '/:id';
			
			if (baseRoute.indexOf(':id') > -1)
				showRoute += (baseRoute.split(':id').length-1);
			
			get( baseRoute + showRoute, manager );
		},
		update: function(baseRoute, manager){
			var showRoute = '/:id';
			
			if (baseRoute.indexOf(':id') > -1)
				showRoute += (baseRoute.split(':id').length-1);
			
			put( baseRoute + showRoute, manager );
		},
		destroy: function(baseRoute, manager){
			var showRoute = '/:id';
			
			if (baseRoute.indexOf(':id') > -1)
				showRoute += (baseRoute.split(':id').length-1);
			
			destroy( baseRoute + showRoute, manager );
		}
	};

	resource = function(){

		var route = arguments[0];
		
		var resourceRoutes = ['index','create','show','update','destroy'];

		for(var i=1; i<arguments.length; i++){
			if (typeof arguments[i] == 'object') {
				var options = arguments[i];
				if (options.only) {
					resourceRoutes = options.only;
				}else if(options.except){
					options.except.forEach(function(rule){
						var ruleIndex = resourceRoutes.indexOf(rule);
						if (ruleIndex > -1)
							resourceRoutes.splice(ruleIndex ,1);
					});
				}
			}
			if (typeof arguments[i] == 'function') {
				var oldPrefix = prefix;
				prefix = route + prefix;
				arguments[i]();
				prefix = oldPrefix;
			}
		}

		resourceRoutes.forEach(function(rest){
			ApplicationController.bindController(route, rest, function(controllerFunction){
				resourceFunctions[rest](route, controllerFunction);
			});
		});

	}

};