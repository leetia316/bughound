'use strict';

const
	db = require('../../database/index.js');

/**
 * 更新用户
 * ====================
 * @param <String> erp ERP
 * @param <name> name 名字
 * @param <String> email 邮箱
 */
module.exports = function(req, res) {
	let uid = req.body.uid,
		name = req.body.name,
		email = req.body.email;
	if(uid && name && email) {
		db.User.update({_id: uid}, {$set: {name:name, email:email}}, function (err, result) {
			if(err) {
				throw err;
				res.sendStatus(500);
			} else if(result.nModified>0) {
				res.sendStatus(200);
			} else {
				res.sendStatus(400);
			}
		});
	} else {
		res.sendStatus(400);
	}
}