'use strict';

const
	db = require('../../database/index.js');

module.exports = function(req, res) {
	let q = req.query.q;
	if(q) {
		db.Sbu.find({name:{'$regex':q, '$options':'i'}}, function(err, docs) {
			if(err) {
				console.log(err);
				res.sendStatus(500);
			} else {
				res.send(docs);
			}
		});
	}
}