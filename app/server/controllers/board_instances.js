var Board_instance 			= require('../models/board_instance');
var Board 					= require('../models/board');
var Customer 				= require('../models/customer');
var Lab 					= require('../models/lab');
var UserRoleBoaredInstance	=	require('../models/user_role_board_instances');
var Provider	=	require('../models/provider');

var Constants 		= require('../constants');
var Utils 			= require('../utils');

var Promise = require('bluebird');
var xmlrpc = require('xmlrpc');

// Create new board instance
exports.create_board_instance = function(req, res) {
	// Technical title : 
	var tachnical_title = "board_instances_create_board_instcance";

    var board_instance = new Board_instance();
    var missing;
    
    Utils.checkToken(req, res, true).then(function(result) {
	if (!result) {
	    Utils.sendUnauthorized(req, res);
	    return;
	}
	// missing = Utils.checkFields(req.body, ["board_id", "label", "customer_id", "lab_id"]);
	// if (missing.length != 0)
	//     return res.send({'error': "Missing followwing properties : " + missing});

	// TODO change when you have the reel data
	board_instance.customer_id 	= Utils.Constants.customer_id;
	board_instance.lab_id 		= Utils.Constants.lab_id;
	board_instance.board_id 	= Utils.Constants.board_id;
	

	board_instance.label 		= req.body.label;
	board_instance.model 		= req.body.model;
	board_instance.version 		= req.body.version;
	board_instance.description 	= req.body.description;
	board_instance.image 		= req.body.image;
	board_instance.nb_niews		= 0;
	board_instance.svg_graphe	= req.body.svg_graphe;
	board_instance.provider_id 	= req.body.provider_id;
	board_instance.category_id 	= req.body.category_id;
	Promise.any([Utils.getUserByToken(req)]).then(function(user) {
		board_instance.created_by 	= user._id;
		board_instance.save(function(err) {
		    if (err)
				Utils.sendError(res, err);
		    // Send result
			res.json({message: 'Board instance created!', details: board_instance, code: Utils.Constants._CODE_OK_});
		});
	});

    });
};

// Get all board instances
exports.get_all_board_instances = function(req, res) {

	// Technical title : 
	var tachnical_title = "board_instances_get_all_board_instances";

	// Get list boards from lava  
	// var callOptions = {
 //                host: 'http://powerci:s01l594hw5xmwd03btaxdzj2dxe7qmz9a5j7300x1qg5edp8uhrg99eesbgww8kmsob8w509o81z5na3akomgi6lsm3inup0om4l91cruzm12l9hqj4ixksdkibbetjb@lava.baylibre.com:10080/RPC2',
 //                params: [{"RequestPayload":'<methodCall><methodName>scheduler.all_devices</methodName><params/></methodCall>'}],
 //                port: 1,
 //    };

	// setTimeout(function () {
	// 	var client = xmlrpc.createClient(callOptions);
	// 	console.log(client);

	// 	// Sends a method call to the XML-RPC server
	//   client.methodCall('scheduler.all_devices',[], function (error, value) {
	//   	console.log('error: ' + error);
	//     // Results of the method response
	//     console.log('Method response for \'scheduler.all_devices\': ' + value)
	//   })
	// }, 1000);


    Utils.isAuthorized(req, res, tachnical_title).then(function(result) {
	if (!result) {
	    Utils.sendUnauthorized(req, res);
	    return;
	}
	Board_instance.find().populate([{path:'created_by'}, {path:'provider_id'}])
				.exec(function(err, board_instances) {
	    if (err)
		Utils.sendError(res, err);
		//console.log(board_instances);
	    // Send result
		res.json({message: Utils.Constants._MSG_OK_, details: board_instances, code: Utils.Constants._CODE_OK_});
	});
    });
};

// Get board instance by id
exports.get_board_instance_by_id = function(req, res) {

	// Technical title : 
	var tachnical_title = "board_instances_get_board_instance_by_id";

    Board_instance.findById(req.params.board_id, function(err, board_instance) {
		if (err)
		    Utils.sendError(res, err);
		Utils.checkToken(req, res, false, Utils.getUsersByCustomer(board_instance.customer_id)).then(function(result) {
			if (!result) {
			    Utils.sendUnauthorized(req, res);
			    return;
			}

			if(req.query.full == Constants._TRUE_) {
				var result = board_instance.toObject();
				// Promis to get doard
				var boardPromise = new Promise(function(resolve, reject) {
					Board.findById(board_instance.board_id, function(err, board){
						if(err) 
							reject(err);
						result.board_id = board.toObject();
						resolve(result);
					})
				});

				// Promis to get customer
				var customerPromis = new Promise(function (resolve, reject) {
					Customer.findById(board_instance.customer_id, function(err, customer){
						if(err)
							reject(err);
						result.customer_id = customer;
						resolve(result);
					})
				});

				// Promis to get Lab
				var labPromis = new Promise(function(resolve, reject) {
					Lab.findById(board_instance.lab_id, function(err, lab){
						if(err)
							reject(err);

						result.lab_id = lab;
						resolve(result);
					});
				});

				Promise.all([labPromis, boardPromise, customerPromis]).then(function(result) {
					res.json({message: Utils.Constants._MSG_OK_, details: result[0], code: Utils.Constants._CODE_OK_});
				});

			// Get object without fetching
			} else 
			// Send result
			res.json({message: Utils.Constants._MSG_OK_, details: board_instance, code: Utils.Constants._CODE_OK_});
		});
    });
};


// Find board instance service
exports.find_board_instcance = function(req, res) {
	// Technical title : 
	var tachnical_title = "board_instances_find_board_instcance";

	// Check if user have permission
	Utils.isAuthorized(req, tachnical_title).then(function(isAuthorized) {

		if(isAuthorized) {

			Board_instance.find({$or :[
										{label: new RegExp('.*' + req.query.requestString + '.*',"i")}, 
										{description: new RegExp('.*' + req.query.requestString + '.*',"i")},
										{model: new RegExp('.*' + req.query.requestString + '.*',"i")},
										{version: new RegExp('.*' + req.query.requestString + '.*',"i")}
									]
								}).populate([{path:'created_by'}, {path:'provider_id'}])
				.exec(function(err, boardInstances) {
				if (err)
					return Utils.sendError(res, err);

				//Send result
				res.json({message: Utils.Constants._MSG_OK_, details: boardInstances, code: Utils.Constants._CODE_OK_});
			});
		
		} else {
			Utils.sendUnauthorized(req, res);
			return;
		}
	});
};

// Update a board instance
exports.update_board_instance = function(req, res) {

	// Technical title : 
	var tachnical_title = "board_instances_update_board_instance";

    Utils.checkToken(req, res, true).then(function(result) {
	if (!result) {
	    Utils.sendUnauthorized(req, res);
	    return;
	}
	Board_instance.findById(req.params.board_id, function(err, board_instance) { 
	    if (err)
			Utils.sendError(res, err);
	    board_instance.name = req.body.name;
	    board_instance.description = req.body.description;
	    board_instance.save(function(err) {
		if (err)
		    Utils.sendError(res, err);
		res.json({ message: 'Board instance updated!' });
	    });	    
	});
    });
};

// Delete a board instance
exports.delete_board_instance = function(req, res) {

	// Technical title : 
	var tachnical_title = "board_instances_delete_board_instance";

	
    Utils.checkToken(req, res, true).then(function(result) {
	if (!result) {
	    Utils.sendUnauthorized(req, res);
	    return;
	}

	Board_instance.findById(req.params.board_id, function(err, board_instance) { 

		var deleteBoardInstanceFromRoles = new Promise(function(resolve, reject) {
					UserRoleBoaredInstance.remove({board_instance_id : board_instance._id}, function(err) {
						if(err) reject(err);
						resolve(true);
					});
				});

		Promise.all([deleteBoardInstanceFromRoles]).then(function(rslt) {
			// delete board instance
			Board_instance.remove({
				_id: req.params.board_id
			}, function(err, board) {
			    if (err)
					Utils.sendError(res, err);
			    res.json({ message: 'Successfully deleted' });
			});
		});

    });
});
};
