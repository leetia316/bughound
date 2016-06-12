'use strict';

const
	db = require('../../database/index.js');

/**
 * 添加用户
 * ====================
 * @param <String> erp ERP
 * @param <name> name 名字
 * @param <String> email 邮箱
 */
module.exports = function(req, res) {
	let erp = req.body.erp,
		name = req.body.name,
		email = req.body.email;
	if(erp && name && email) {
		let user = new db.User({
			erp: erp,
			name: name,
			email: email
		});
		user.save(function(err) {
			if(err) {
				throw err;
				res.sendStatus(500);
			} else {
				res.json({erp:erp, name:name, email:email});
			}
		});
	} else {
		res.sendStatus(400);
	}
}