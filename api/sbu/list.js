'use strict';

const
	db = require('../../database/index.js');

/**
 * 业务列表
 * ====================
 */
module.exports = function(req, res) {
	db.Sbu.find({}, function(err, docs) {
		if(err) {
			throw err;
			res.sendStatus(500);
		} else {
			res.send(docs);
		}
	});
}