'use strict';

const
	db = require('../../database/index.js');

module.exports = function(req, res) {
	console.log(req.body.erp, req.body.name, req.body.email)
	let erp = req.body.erp,
		name = req.body.name,
		email = req.body.email;
	if(erp && name) {
		let user = new db.User({
			erp: erp,
			name: name,
			email: email
		});
		user.save(function(err) {
			if(err) {
				res.sendStatus(500);
			} else {
				res.json({erp:erp, name:name});
			}
		});
	} else {
		res.sendStatus(404);
	}
}