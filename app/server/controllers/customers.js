var Customer = require('../models/customer');
var Board_instance = require('../models/board_instance');
var Promise = require('bluebird');
var Lab = require('../models/lab');
var Board = require('../models/board');
var Utils = require('../utils');

// Create customer
exports.cretaeCustomer = function(req, res) {

	// Technical title : 
	var tachnical_title = "customersControllerCreateCustomer";

    var customer = new Customer();
	
    Utils.checkToken(req, res, true).then(function(result) {
	customer.name = req.body.name;
	customer.company = req.body.company;
	customer.address = req.body.address;
	customer.telephone = req.body.telephone;
	//customer.board_instances = req.body.board_instances;
	customer.user_id = req.body.user_id;
    
	customer.save(function(err) {
	    if (err)
		res.send(err);

	    res.json({message: Utils.Constants._MSG_CREATED_, details: customer, code: Utils.Constants._CODE_CREATED_});
	});
    });
};

// Get all customers
exports.getAllCustomers = function(req, res) {

	// Technical title : 
	var tachnical_title = "customersControllerGetAllCustomers";


    Customer.find({}, function(err, customers) {
	if (err)
	    res.send(err);
	Promise.all(customers.map(function(customer) {
	    return new Promise(function (resolve, reject) {
		Board_instance.find({customer_id: customer}, function (error, board_instances) {
		    if (error) {
			reject(error);
			return;
		    }
		    var r = customer.toObject();
		    r.board_instances = Array();
		    board_instances.forEach(function(item) {
			r.board_instances.push(item._id);
		    });
		    resolve(r);
		});
	    });
	})).then(function(fullCustomers) {
	    var o = Array();

	    res.json(fullCustomers);
	});
    });
};

// Get customer by Id
exports.getCustomerById = function(req, res) {

	// Technical title : 
	var tachnical_title = "customersControllerGetCustomerById";


    Customer.findById(req.params.customer_id, function(err, customer) {
	if (err)
	    res.send(err);
	Board_instance.find({'customer_id': customer._id}, function(err, board_instances) {
	    if (err)
		res.send(err);
	    var r = customer.toObject();

	    Promise.all(board_instances.map(function(board_instance) {
		return new Promise(function(resolve, reject) {
		    Lab.findById(board_instance.lab_id, function(err, lab) {
			var i = board_instance.toObject();
			    
			i.lab_id = lab;
			Board.findById(board_instance.board_id, function(err, board) {
			    i.board_id = board;
			    resolve(i);
			});
		    });
		});
	    })).then(function(fullBoardInstances) {
		r.board_instances = fullBoardInstances;
		res.json(r);
	    });;
	});
    });
};

// Update customer
exports.updateCustomer = function(req, res) {

	// Technical title : 
	var tachnical_title = "customersControllerUpdateCustomer";

    Customer.findById(req.params.customer_id, function(err, customer) { 
	if (err)
	    res.send(err);
	    
	customer.name = req.body.name;
	customer.save(function(err) {
	    if (err)
		res.send(err);
		
	    res.json({ message: 'Customer updated!' });
	});	    
    });
};

// Delete custoer
exports.deleteCustomer = function(req, res) {

	// Technical title : 
	var tachnical_title = "customersControllerDeleteCustomer";

    Customer.remove({
	_id: req.params.customer_id
    }, function(err, customer) {
	if (err)
	    res.send(err);
	    
	res.json({ message: 'Successfully deleted' });
    });
};


