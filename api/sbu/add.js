'use strict';

const
	db = require('../../database/index.js');

/**
 * 添加业务
 * ====================
 * @param <String> name 业务名字
 */
module.exports = function(req, res) {
	let name = req.body.name;
	if(name) {
		let sbu = new db.Sbu({
			name: name
		});
		sbu.save(function(err) {
			if(err) {
				throw err;
				res.sendStatus(500);
			} else {
				res.sendStatus(200);
			}
		});
	} else {
		res.sendStatus(400);
	}
}