// Mapping objects
var Category	=	require('../models/category');

// Import Modules
var Promise = require('bluebird');

// Utils
var Utils	= require('../utils');

// parm's var
var param_category_id = "id_category";
var param_name = "name";


// Get list of all categories
exports.getCategories = function(req, res) {
	// Technical title : 
	var tachnical_title = "categoriesControllerGetCategories";

	Utils.checkToken(req, res, true).then(function(result) {
		if(!result) {
			Utils.sendUnauthorized(req, res);
			return;
		}
		Category.find().populate('created_by')
				.exec(function(err, categories) {
			if(err)
				res.send(err)
			res.json({message: Utils.Constants._MSG_OK_, details: categories, code: Utils.Constants._CODE_OK_});
		});
	})
};

// Get category by id
exports.getGategoryById = function(req, res) {

	// Technical title : 
	var tachnical_title = "categoriesControllerGetCategoryById";

	Utils.checkToken(req, res, true).then(function(result) {
		if(!result) {
			Utils.sendUnauthorized(req, res);
			return;
		}
		Category.findById(req.params.id_category, function(err, category) {
			if(err)
				res.send(err);
			res.json({message: Utils.Constants._MSG_OK_, details: category, code: Utils.Constants._CODE_OK_});
		});
	})

};

// Find categories
exports.findCategories = function(req, res) {

	// Technical title : 
	var tachnical_title = "categoriesControllerFindCategories";

	Utils.checkToken(req, res, true).then(function(result) {
		if(!result) {
			Utils.sendUnauthorized(req, res);
			return;
		}
		Category.find({$or :[
							{name: new RegExp('.*' + req.query.requestString + '.*',"i")}, 
							{description: new RegExp('.*' + req.query.requestString + '.*',"i")}
						]
					}).populate('created_by')
				.exec(function(err, categories) {
			if(err)
				res.send(err);
			res.json({message: Utils.Constants._MSG_OK_, details: categories, code: Utils.Constants._CODE_OK_});
		});
	})

};

// Update Categorie
exports.updateCategory = function(req, res) {

	// Technical title : 
	var tachnical_title = "categoriesControllerUpdateCategory";

	Utils.checkToken(req, res, true).then(function(result) {
		if(!result) {
			Utils.sendUnauthorized(req, res);
			return;
		}
		// Check request parms
		missing = Utils.checkFields(req.body, [param_name]);
		if(missing.length !=0) 
			return Utils.sendMissingParams(res, missing);

		Category.findById(req.params.id_category, function(err, category){
			if(err)
				res.send(err)
			if(category != null) {
				Category.find({_id: {"$ne": category._id},name: req.body.name}, function(err, categoryNameExist){
					if(err) res.send(err) ;
					if(categoryNameExist != null && categoryNameExist.length > 0){
						res.json({message: Utils.Constants._MSG_KO_, details: "Category name is already used!", code: Utils.Constants._CODE_MODIFIED_});
					} else {
						category.description 	= req.body.description;
					    category.name 			= req.body.name;
					    category.image 			= req.body.image;
						category.save(function(err) {
							if(err) res.send(err);
							res.json({message: Utils.Constants._MSG_MODIFIED_, details: "Category updated", code: Utils.Constants._CODE_MODIFIED_});

						})

					}
				});
			} else 
				res.json({message: Utils.Constants._MSG_OK_, details:"Category not found!",code:_CODE_OK_});		
		});
	});
};

// Create Category
exports.createCategory = function(req, res) {

	// Technical title : 
	var tachnical_title = "categoriesControllerCreateCategory";

	Utils.checkToken(req, res, true).then(function(result) {
		if(!result) {
			Utils.sendUnauthorized(req, res);
			return;
		}
		// Check request parms
		missing = Utils.checkFields(req.body, [param_name]);
		if(missing.length !=0) 
			return Utils.sendMissingParams(missing);

		Category.find({name: req.body.name}, function(err, categoryNameExist){
			if(err) res.send(err) ;
			if(categoryNameExist != null && categoryNameExist.length > 0)
				res.json({message: Utils.Constants._MSG_KO_, details: "Category name is already used!", code: Utils.Constants._CODE_MODIFIED_});
			else {

				// Mpping request params
		    	var category = new Category();
		    	category.description 	= req.body.description;
			    category.name 			= req.body.name;
			    category.image 			= req.body.image;
			    Promise.any([Utils.getUserByToken(req)]).then(function(user) {
					category.created_by 	= user._id;
					// Save object
				    category.save(function(err){
				    	// Check errors
				    	if(err)
				    		res.send(err);
				    	
				    	// Send ok message
				    	res.json({message: Utils.Constants._MSG_OK_, details:"Category created!",code:Utils.Constants._CODE_OK_});
			    	});
				});

			}
		});	
	});
};

// delete Category
exports.deleteCategory = function(req, res) {
	Utils.checkToken(req, res, true).then(function(result) {
		if(!result) {
			Utils.sendUnauthorized(req, res);
			return;
		}
		// Get test case by Id
		Category.findById(req.params.id_category, function(err, category){
			if(err)
				res.send(err);
			if(category != null) {
				// delete category
				Category.remove({_id : req.params.id_category }, function(err, testCase) {
					if(err)
						res.send(err);
					res.json({message: Utils.Constants._MSG_DELETED_, details:"Category Successfully deleted!",code: Utils.Constants._CODE_DELETED_});

				});
			} else 
				res.json({message: Utils.Constants._MSG_OBJECT_NOT_FOUND_, details:"Category not found!",code: Utils.Constants._CODE_ARGS_});

		});
	});
};

function e(string) {
	console.log(string);
}