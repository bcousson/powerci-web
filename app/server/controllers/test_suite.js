// Mapped Objects
var TestSuite 	= require('../models/test_suite');
var TestCase 	= require('../models/test_case');

// Modules
var Promise 	= require('bluebird');

// Utils
var Utils 		= require('../utils');
var Constants	= require('../constants');

// Create test suite
exports.createTestSuite = function(req, res) {

	// Technical title : 
	var tachnical_title = "create_test_suite";

    // Check user token
    Utils.checkToken(req, res, false).then(function(result){
    	if(!result) {
    		Utils.sendUnauthorized(req, res);
    		return;
    	}

    	// Check request parms
    	missing = Utils.checkFields(req.body, ["description"]);
    	if(missing.length !=0) 
    		return res.send({'error' : "Missing followwing property : " + missing});

    	// Mpping request params
    	var testSuite = new TestSuite();

    	testSuite.description 		= req.body.description;
    	testSuite.tests_case 		= req.body.tests_case;
	    testSuite.created_on 		= Date.now() / 1000 | 0;

	    // Save test suite object
	    testSuite.save(function(err){
	    	// Check errors
	    	if(err)
	    		res.send(err);
	    	
	    	// Send ok message
	    	res.json({message: 'Test suite created!'});
    	});
    });  
};

// Get all tests suite
exports.getAllTestsSuite= function(req, res) {

	// Technical title : 
	var tachnical_title = "get_all_tests_suite";

	// Check user token
	Utils.checkToken(req,res,true).then(function(result){
		// Send error for a bad tokens 
		if(!result) {
			Utils.sendUnauthorized(req, res);
			return;
		}
		// Get list of tests suite
		TestSuite.find({}, function(err, testsStuite) {
			// Check the response
			if(err) 
				res.send(err);
			// Send response
			res.json(testsStuite);
		});
	});
};

// Get test suite by Id
exports.getTestSuiteById = function(req, res) {

	// Technical title : 
	var tachnical_title = "get_test_suite_by_id";

	// Check user token
	Utils.checkToken(req, res, true).then (function(result) {
		if(!result) {
			Utils.sendUnauthorized(req, res);
			return;
		}
		// Get test suite by Id
		TestSuite.findById(req.params.test_suite_id, function(err, testSuite){
			if(err)
				res.send(err);
			var result = null;

			if(testSuite != null) {
				result = testSuite.toObject();

				if(req.query.full == Constants._TRUE_) {

					var testCasesPromis = new Promise(function(resolve, reject) {
						TestCase.find({_id : {"$in" : [result.tests_case]}}, function(err, testsCase) {
							if(err) 
								reject(err);
							result.tests_case = testsCase.toObject();
							resolve(result);
						});
					});

					Promise.all([testCasesPromis]).then(function(result){
						// Get result
						res.json({message: Constants._CODE_OK_, details: result, code: Constants._CODE_OK_});
						return;
					});

				} else 
					// Get result
					res.json({message: Utils.Constants._CODE_OK_, details: result, code: Utils.Constants._CODE_OK_});

			} else
				// Get result
				res.json({message: Utils.Constants._CODE_OK_, details: result, code: Utils.Constants._CODE_OK_});
		});
	});
};

// Update test suite
exports.updateTestSuite = function(req, res) {

	// Technical title : 
	var tachnical_title = "update_test_suite";

	// Check user token
	Utils.checkToken(req, res, true).then (function(result) {
		if(!result) {
			Utils.sendUnauthorized(req, res);
			return;
		}

		// Get test suite by Id
		TestSuite.findById(req.params.test_suite_id, function(err, testSuite){
			if(err)
				res.send(err);

			if (testSuite != null) {
				// Mapping params
				if(req.body.description !== undefined && req.body.description != "") {
					testSuite.description 		= req.body.description;
				}
				if(req.body.tests_case !== undefined && req.body.tests_case != "") {
					testSuite.tests_case 		= req.body.tests_case;
				}

				// Update test suite object
				testSuite.save(function(err) {
					if(err)
						res.send(err);
					res.json({message : 'Test Suite updated!'});
				});
						
			} else 
				res.json({message : 'Test Suite not found!'});
		});
	});
};

// delete test suite
exports.deleteTestSuite = function(req, res) {

	// Technical title : 
	var tachnical_title = "delete_test_suite";

	// Check user token
	Utils.checkToken(req, res, true).then (function(result) {
		if(!result) {
			Utils.sendUnauthorized(req, res);
			return;
		}

		// Get test suite by Id
		TestSuite.findById(req.params.test_suite_id, function(err, testSuite){
			if(err)
				res.send(err);
			else if(testSuite != null) {
				// delete test suite by id
				TestSuite.remove({_id : req.params.test_suite_id }, function(err) {
					if(err)
						res.send(err);
					res.json({message : 'test suite saccessfully deleted!'});
				});
			} else 
				res.json({message : 'Test suite not found!'})
		});

	});
};