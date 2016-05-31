'use strict';

const
	db = require('../../database/index.js');

module.exports = function(req, res) {
	let name = req.body.name;
	if(name) {
		let sbu = new db.Sbu({
			name: name
		});
		sbu.save(function(err) {
			if(err) {
				res.sendStatus(500);
			} else {
				res.sendStatus(200);
			}
		});
	} else {
		res.sendStatus(404);
	}
}