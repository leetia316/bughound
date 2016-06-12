'use strict';

const
	db = require('../../database/index.js');

/**
 * 需求列表
 * ====================
 */
module.exports = function(req, res) {
	db.Demand.find({})
		.populate('sbu')
		.populate({
			path: 'news',
			populate: { path: 'files', model: 'File'}
		})
		.sort({'updatedAt': -1})
		.exec(function (err, docs) {
			if(err) {
				throw err;
				res.sendStatus(500);
			} else {
				res.send(docs);
			}
		});
}