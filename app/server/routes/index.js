// Controllers
var BoardsController 			= require('../controllers/boards');
var LabsController 				= require('../controllers/labs');
var Board_instancesController 	= require('../controllers/board_instances');
var CustomersController 		= require('../controllers/customers');
var UsersController 			= require('../controllers/users');
var ProjectController 			= require('../controllers/projects');
var TestCaseController 			= require('../controllers/test_case');
var TestSuiteController 		= require('../controllers/test_suite');
var SocsController 				= require('../controllers/socs');
var GroupsController 			= require('../controllers/groups');
var RolesController 			= require('../controllers/roles');
var ActionsController 			= require('../controllers/actions');
var ProvidersController			= require('../controllers/providers');
var CategoriesController		= require('../controllers/categories');
var jwt    						= require('jsonwebtoken');

// Models
var User = require('../models/user');
//Mongoose
var mongoose = require('mongoose');
var Schema		= mongoose.Schema, ObjectId = Schema.ObjectId;

// Utils
var Utils = require('../utils');

module.exports = function(app, express) {


    var router = express.Router();

    // Authentication
    router.route('/login')
	.post(UsersController.login);
 //    router.route('/logout')
	// .post(UsersController.logout);
    

    // route middleware to verify a token
	router.use(function(req, res, next) {
	   var token = null;
	   if(req.headers.authorization != null) {
	        var authorization = req.headers.authorization.split(" ");
	        if(authorization.length === 2) {
	            var key = authorization[0];
	            var val = authorization[1];
	            if(/^Bearer$/i.test(key)) {
	                token = val.replace(/"/g, "");
	            }
	        }
	          // console.log(token);
			  // decode token
			  if (token != null) {
			    // verifies secret and checks exp
			    jwt.verify(token, Utils.Constants.BAYLIBRE_SECRET_KEY, function(err, decoded) {      
			      if (err) {
			        return res.json({message: Utils.Constants._MSG_FAILED_, details: "Authonticate required", code: Utils.Constants._AUTHONTICATE_REQUIRED_});    
			      } else {
			        // if everything is good, save to request for use in other routes
			        User.findById({_id: mongoose.Types.ObjectId(decoded.data)}, function(err, user) {
			        	if(err || null == user) {
			        		return res.json({message: Utils.Constants._MSG_FAILED_, details: "Authonticate required", code: Utils.Constants._AUTHONTICATE_REQUIRED_});    
			        	}
			        	var login = {};
			        	login.avatar = user.avatar;
			        	login.username = user.username;
			        	login.first_name = user.first_name;
			        	login.last_name = user.last_name;
			        	login._id = user._id;
			        	req.login = login;
			        	next();
			        });
			      }
			    });
			  } else {
			    // if there is no token
			    return 
			        return res.json({message: Utils.Constants._MSG_FAILED_, details: "Authonticate required", code: Utils.Constants._AUTHONTICATE_REQUIRED_});
			  }
		} else {return res.json({message: Utils.Constants._MSG_FAILED_, details: "Authonticate required", code: Utils.Constants._AUTHONTICATE_REQUIRED_});}
	});

    router.get('/', function(req, res) {
	res.json({message: Utils.Constants._MSG_WELCOME_, details: global.config.global.welcomeMessage, code: Utils.Constants._CODE_WELCOME_});	
    });

    /* BOARDS Routs */
    router.route('/boards')
	.post(BoardsController.createBoard)
	.get(BoardsController.getAllBoards);
    router.route('/boards/:board_id')
	.get(BoardsController.getBoardById)
	.delete(BoardsController.deleteBoard)
	.put(BoardsController.updateBoard);
    
    /* LABS Routs */
    router.route('/labs')
	.post(LabsController.createLabs)
	.get(LabsController.getAllLabs);
    router.route('/labs/:lab_id')
	.get(LabsController.getLabsById)
	.delete(LabsController.deleteLabs)
	.put(LabsController.updateLabs);

    /* BOARD_INSTANCES RES */
    router.route('/board_instances')
	.get(Board_instancesController.get_all_board_instances);
	router.route('/board_instances/find')
	.get(Board_instancesController.find_board_instcance);
	router.route('/board_instance')
	.post(Board_instancesController.create_board_instance);
    router.route('/board_instance/:board_id')
	.get(Board_instancesController.get_board_instance_by_id)
	.put(Board_instancesController.update_board_instance)
	.delete(Board_instancesController.delete_board_instance);

    /* CUSTOMERS RES */
    router.route('/customers')
	.post(CustomersController.cretaeCustomer)
	.get(CustomersController.getAllCustomers);
    router.route('/customers/:customer_id')
	.get(CustomersController.getCustomerById)
	.delete(CustomersController.deleteCustomer)
	.put(CustomersController.updateCustomer);

    /* USERS RES */
    router.route('/users')
	.get(UsersController.getUsers);
	router.route('/user')
	.post(UsersController.createUser);
    router.route('/forgot')
	.post(UsersController.forgot);
    router.route('/forgot/:forgot_id/:hash')
	.get(UsersController.useForgotToken);
    router.route('/user/:user_id')
	.get(UsersController.getUserById)
	.put(UsersController.updateUser)
	.delete(UsersController.deleteUser);
	router.route('/users/find')
	.get(UsersController.findUser);
	router.route('/connecteduser')
	.get(UsersController.getConnectedUser);

    /* PROJECT RES */
    router.route('/projects')
	.post(ProjectController.createProject)
	.get(ProjectController.getAllProjects);
    router.route('/projects/:project_id')
	.get(ProjectController.getProjectById)
	.put(ProjectController.updateProject)
	.delete(ProjectController.deleteProject);

    /* Test case*/
    router.route('/test_case')
	.post(TestCaseController.createTestCase)
	.get(TestCaseController.getAllTestsCase);
    router.route('/test_case/:test_case_id')
	.put(TestCaseController.updateTestCase)
	.get(TestCaseController.getTestCaseBayId)
	.delete(TestCaseController.deleteTestCase);

	/* Test suite*/
    router.route('/test_suite')
	.post(TestSuiteController.createTestSuite)
	.get(TestSuiteController.getAllTestsSuite);
    router.route('/test_suite/:test_suite_id')
	.put(TestSuiteController.updateTestSuite)
	.get(TestSuiteController.getTestSuiteById)
	.delete(TestSuiteController.deleteTestSuite);

	/* Socs routes */
	router.route('/soc')
	.post(SocsController.createSoc)
	.get(SocsController.getAllSocs);
	router.route('/soc/:soc_id')
	.put(SocsController.updateSoc)
	.get(SocsController.getSocById)
	.delete(SocsController.deleteSoc);

	/* Group routes */
	router.route('/groups')
	.get(GroupsController.getGroups);
	router.route('/group')
	.post(GroupsController.createGroup);
	router.route('/group/find')
	.get(GroupsController.findGroup);
	router.route('/group/user_role')
	.post(GroupsController.userRole)
	.delete(GroupsController.removeUser);
	router.route('/groups/find_users_roles')
	.get(GroupsController.findUserRole);
	router.route('/group/board_instance')
	.post(GroupsController.addBoardInstance);
	router.route('/group/board_instance_details')
	.get(GroupsController.boardInstanceDetails);
	router.route('/group/board_instance/:board_instance_id')
	.delete(GroupsController.removeBoardInstance);
	router.route('/group/add_user_in_board_instance')
	.post(GroupsController.addUserToBoardInstance)
	.delete(GroupsController.removeUserFromBoardInstance);
	router.route('/group/:group_id')
	.put(GroupsController.updateGroup)
	.get(GroupsController.getGroup)
	.delete(GroupsController.deleteGroup);


	/* Role routes */
	router.route('/roles')
	.get(RolesController.getRoles);
	router.route('/roles/group')
	.get(RolesController.getRolesByGroupId);
	router.route('/role')
	.post(RolesController.createRole);
	router.route('/role/:role_id')
	.put(RolesController.updateRole)
	.get(RolesController.getRoleById)
	.delete(RolesController.deleteRole);
	router.route('/roles/find')
	.get(RolesController.findRole);

	/* Actions routes */
	router.route('/actions')
	.get(ActionsController._get_actions);
	router.route('/action/:id_action')
	.put(ActionsController._update_action)
	.get(ActionsController._get_action);

	/* Provider routes */
	router.route('/providers')
	.get(ProvidersController.getProviders);
	router.route('/provider/find')
	.get(ProvidersController.findProvider);
	router.route('/provider/:id_provider')
	.delete(ProvidersController.deleteProvider)
	.get(ProvidersController.getProviderById)
	.put(ProvidersController.updateProvider);
	router.route('/provider')
	.post(ProvidersController.createProvider);

	/* Categories routes */
	router.route('/categories')
	.get(CategoriesController.getCategories);
	router.route('/category/find')
	.get(CategoriesController.findCategories);
	router.route('/category/:id_category')
	.delete(CategoriesController.deleteCategory)
	.get(CategoriesController.getGategoryById)
	.put(CategoriesController.updateCategory);
	router.route('/category')
	.post(CategoriesController.createCategory);

    
    app.use('/', router);
};
