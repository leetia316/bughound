'use strict';

const
	db = require('../../database/index.js');

module.exports =function(req, res) {
	let erp = req.body.erp;
	if(!erp) {
		res.sendStatus(404);
	} else {
		db.User.findOneAndRemove({erp:erp}, function(err, doc, result) {
			if(err) {
				res.sendStatus(500);
			} else {
				res.sendStatus(200);
			}
		});
	}
}