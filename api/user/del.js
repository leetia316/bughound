'use strict';

const
	db = require('../../database/index.js');

/**
 * 删除用户
 * ====================
 * @param <String> erp ERP
 */
module.exports =function(req, res) {
	let uid = req.body.uid;
	if(!uid) {
		res.sendStatus(400);
	} else {
		db.User.findOneAndRemove({_id:uid}, function(err, doc, result) {
			if(err) {
				throw err;
				res.sendStatus(500);
			} else {
				res.sendStatus(200);
			}
		});
	}
}