'use strict';

const
	db = require('../../database/index.js');

module.exports =function(req, res) {
	db.User.find({}, function(err, docs) {
		if(err) {
			res.sendStatus(500);
		} else {
			res.send(docs);
		}
	});
}