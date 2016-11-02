// Mapping objects
var Provider	=	require('../models/provider');

// Import Modules
var Promise = require('bluebird');

// Utils
var Utils	= require('../utils');

// parm's var
var param_provider_id = "id_provider";
var param_name = "name";


// Create Provider
exports.createProvider = function(req, res) {

	// Technical title : 
	var tachnical_title = "providerControllerCreateProvider";

	Utils.checkToken(req, res, true).then(function(result) {
		if(!result) {
			Utils.sendUnauthorized(req, res);
			return;
		}
		// Check request parms
		missing = Utils.checkFields(req.body, [param_name]);
		if(missing.length !=0) 
			return Utils.sendMissingParams(missing);

		Provider.find({name: req.body.name}, function(err, providerNameExist){
			if(err) res.send(err) ;
			if(providerNameExist != null && providerNameExist.length > 0)
				res.json({message: Utils.Constants._MSG_KO_, details: "Provider name is already used!", code: Utils.Constants._CODE_MODIFIED_});
			else {

				// Mpping request params
		    	var provider = new Provider();
		    	provider.description 	= req.body.description;
			    provider.name 			= req.body.name;
			    provider.image 			= req.body.image;
			    Promise.any([Utils.getUserByToken(req)]).then(function(user) {
					provider.created_by 	= user._id;
					// Save object
				    provider.save(function(err){
				    	// Check errors
				    	if(err)
				    		res.send(err);
				    	
				    	// Send ok message
				    	res.json({message: Utils.Constants._MSG_OK_, details:"Provider created!",code:Utils.Constants._CODE_OK_});
			    	});
				});

			}
		});	
	});
};

// Get all providers
exports.getProviders = function(req, res) {

	// Technical title : 
	var tachnical_title = "providerControllerGetProviders";

	Utils.checkToken(req, res, true).then(function(result) {
		if(!result) {
			Utils.sendUnauthorized(req, res);
			return;
		}
		Provider.find().populate('created_by')
				.exec(function(err, providers) {
			if(err)
				res.send(err)
			res.json({message: Utils.Constants._MSG_OK_, details: providers, code: Utils.Constants._CODE_OK_});
		});
	})
};

// Get provider by id
exports.getProviderById = function(req, res) {

	// Technical title : 
	var tachnical_title = "providerControllerGetProviderById";

	Utils.checkToken(req, res, true).then(function(result) {
		if(!result) {
			Utils.sendUnauthorized(req, res);
			return;
		}
		Provider.findById(req.params.id_provider, function(err, provider) {
			if(err)
				res.send(err);
			res.json({message: Utils.Constants._MSG_OK_, details: provider, code: Utils.Constants._CODE_OK_});
		});
	})

};

// Find provider
exports.findProvider = function(req, res) {

	// Technical title : 
	var tachnical_title = "providerControllerFindProvider";

	Utils.checkToken(req, res, true).then(function(result) {
		if(!result) {
			Utils.sendUnauthorized(req, res);
			return;
		}
		Provider.find({$or :[
								{name: new RegExp('.*' + req.query.requestString + '.*',"i")}, 
								{description: new RegExp('.*' + req.query.requestString + '.*',"i")}
							]
						}).populate('created_by')
				.exec(function(err, providers) {
			if(err)
				res.send(err);
			res.json({message: Utils.Constants._MSG_OK_, details: providers, code: Utils.Constants._CODE_OK_});
		});
	})

};

// Update provider
exports.updateProvider = function(req, res) {

	// Technical title : 
	var tachnical_title = "providerControllerUpdateProvider";

	Utils.checkToken(req, res, true).then(function(result) {
		if(!result) {
			Utils.sendUnauthorized(req, res);
			return;
		}
		// Check request parms
		missing = Utils.checkFields(req.body, [param_name]);
		if(missing.length !=0) 
			return Utils.sendMissingParams(res, missing);

		Provider.findById(req.params.id_provider, function(err, provider){
			if(err)
				res.send(err)
			if(provider != null) {
				Provider.find({_id: {"$ne": provider._id},name: req.body.name}, function(err, providerNameExist){
					if(err) res.send(err) ;
					if(providerNameExist != null && providerNameExist.length > 0){
						res.json({message: Utils.Constants._MSG_KO_, details: "Provider name is already used!", code: Utils.Constants._CODE_MODIFIED_});
					} else {
						provider.description 	= req.body.description;
					    provider.name 			= req.body.name;
					    provider.image 			= req.body.image;
						provider.save(function(err) {
							if(err) res.send(err);
							res.json({message: Utils.Constants._MSG_MODIFIED_, details: "Provider updated", code: Utils.Constants._CODE_MODIFIED_});

						})

					}
				});
			} else 
				res.json({message: Utils.Constants._MSG_OK_, details:"Provider not found!",code:_CODE_OK_});		
		});
	});
};

// Delete Provider
exports.deleteProvider = function(req, res) {

	// Technical title : 
	var tachnical_title = "providerControllerDeleteProvider";

	Utils.checkToken(req, res, true).then(function(result) {
		if(!result) {
			Utils.sendUnauthorized(req, res);
			return;
		}
		// Get test case by Id
		Provider.findById(req.params.id_provider, function(err, provider){
			if(err)
				res.send(err);
			if(provider != null) {
				// delete provider
				Provider.remove({_id : req.params.id_provider }, function(err, testCase) {
					if(err)
						res.send(err);
					res.json({message: Utils.Constants._MSG_DELETED_, details:"Provider Successfully deleted!",code: Utils.Constants._CODE_DELETED_});

				});
			} else 
				res.json({message: Utils.Constants._MSG_OBJECT_NOT_FOUND_, details:"Provider not found!",code: Utils.Constants._CODE_ARGS_});

		});
	});
};