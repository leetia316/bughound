'use strict';

const
	db = require('../../database/index.js');

module.exports = function(req, res) {
	db.Sbu.find({}, function(err, docs) {
		if(err) {
			console.log(err);
			res.sendStatus(500);
		} else {
			res.send(docs);
		}
	});
}