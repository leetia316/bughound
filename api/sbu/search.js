'use strict';

const
	db = require('../../database/index.js');

/**
 * 业务搜索，暂未启用
 * ====================
 * @param <String> q 查询串
 */
module.exports = function(req, res) {
	let q = req.query.q;
	if(q) {
		db.Sbu.find({name:{'$regex':q, '$options':'i'}}, function(err, docs) {
			if(err) {
				throw err;
				res.sendStatus(500);
			} else {
				res.send(docs);
			}
		});
	} else {
		res.sendStatus(400);
	}
}