function ApplicationController(resource){
	this.resource = resource;
	if(Models.hasOwnProperty(resource)){
		this.model = Models[resource];
	}else{
		console.log("Resource: ", resource, " has no model defined");
	}
}
ApplicationController.prototype.index = function(req, res){
	if( this.model ){
		var search = {};
		if(req.query.filter && req.query.with)
			search[req.query.filter] = req.query.with;
		this.model.find(search, function(err, list){
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
	}else
		res.send([]);
}
ApplicationController.prototype.create = function(req, res){
	if(this.model){
		this.model.create( req.body[this.resource], (function(err, newModel){
			if(err){
				err.success = false
				res.send(err);
			}else{
				resp = { success: true };
				resp[this.resource] = newModel.toObject();
				resp[this.resource].creationDate = newModel._id.getTimestamp();
				res.send(resp);
			}
		}).bind(this));
	}else
		res.send({ success: false, msg: 'No Model for the defined Resource' });
}
ApplicationController.prototype.show = function(req, res){
	if(this.model){
		this.model.findOne({ _id: req.params.id }, function(err, one){
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
	}else
		res.send([]);
}
ApplicationController.prototype.update = function(req, res){
	if(this.model){
		this.model.findOneAndUpdate({ _id: req.params.id }, req.body[this.resource], (function(err, upd){
			if(err){
				err.success = false;
				res.send(err);
			}else if(!upd)
				res.status(404).end();
			else{
				var resp = {success: true};
				resp[this.resource] = upd.toObject().
				resp[this.resource].creationDate = upd._id.getTimestamp();
				res.send(resp);
			}
		}).bind(this));
	}else{
		res.send({ success: false, msg: 'No Model for defined resource' });
	}
}

ApplicationController.prototype.destroy =  function(req, res){
	if(this.resource){
			this.model.findOne({ _id: req.params.id }, function(err, one){
				if(err){
					err.success = false;
					res.send(err);
				}else if(!one)
					res.status(404).end();
				else{
					res.send({ success: true });
				}
			});
	}else
		res.send({ success: false, msg: 'No Model for defined resource' });
}

module.exports = ApplicationController;