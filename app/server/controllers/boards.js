var Board = require('../models/board');
var Utils = require('../utils');

// Create board
exports.createBoard = function(req, res) {

	// Technical title : 
	var tachnical_title = "boardControllerCreateBoard";

    var board = new Board();
    var missing;
	
    Utils.checkToken(req, res, true).then(function(result) {
	if (!result) {
	    Utils.sendUnauthorized(req, res);
	    return;
	}
	missing = Utils.checkFields(req.body, ["name", "manufacturer", "model", "image"]);
	if (missing.length != 0)
	    return res.send({'error': "Missing followwing properties : " + missing});
	board.name 			= req.body.name;
	board.sub_name 		= req.body.sub_name;
	board.manufacturer 	= req.body.manufacturer;
	board.model 		= req.body.model;
	board.image 		= req.body.mode;
	board.created_by 	= req.body.created_by;
    board.created_on 	= Date.now() / 1000 | 0;
    board.nb_units 		= req.body.nb_units;
    board.nb_use_cases 	= req.body.nb_use_cases;
	    
	// Save Object
	board.save(function(err) {
	    if (err)
		res.send(err);
	    res.json({ message: 'Board created!' });
	});
    });
};

// Get all boards
exports.getAllBoards = function(req, res) {

	// Technical title : 
	var tachnical_title = "boardControllerGetAllBoards";

    Utils.checkToken(req, res, true).then(function(result) {
	if (!result) {
	    Utils.sendUnauthorized(req, res);
	    return;
	}
	Board.find(function(err, boards) {
	    if (err)
		res.send(err);
	    res.json(boards);
	});
    });
};

// Get board by id
exports.getBoardById = function(req, res) {

	// Technical title : 
	var tachnical_title = "boardControllerGetBoardById";

    Board.findById(req.params.board_id, function(err, board) {
	if (err)
	    res.send(err);
	res.json(board);
    });
};

// Update board
exports.updateBoard = function(req, res) {

	// Technical title : 
	var tachnical_title = "boardControllerUpdateBoard";

    Utils.checkToken(req, res, true).then(function(result) {
	if (!result) {
	    Utils.sendUnauthorized(req, res);
	    return;
	}
	Board.findById(req.params.board_id, function(err, board) { 
	    if (err)
		res.send(err);
	    
	    board.name = req.body.name;
	    board.save(function(err) {
		if (err)
		    res.send(err);
		res.json({ message: 'Board updated!' });
	    });	    
	});
    });
};

// Delete board
exports.deleteBoard = function(req, res) {

	// Technical title : 
	var tachnical_title = "boardControllerDeleteBoard";

    Utils.checkToken(req, res, true).then(function(result) {
	if (!result) {
	    Utils.sendUnauthorized(req, res);
	    return;
	}
	Board.remove({
	    _id: req.params.board_id
	}, function(err, board) {
	    if (err)
		res.send(err);	    
	    res.json({ message: 'Successfully deleted' });
	});
    });
};


