'use strict';

const
	db = require('../../database/index.js');

/**
 * 用户列表
 * ====================
 */
module.exports =function(req, res) {
	db.User.find({}, function(err, docs) {
		if(err) {
			throw err;
			res.sendStatus(500);
		} else {
			res.send(docs);
		}
	});
}