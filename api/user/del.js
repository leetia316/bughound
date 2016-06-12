'use strict';

const
	db = require('../../database/index.js');

/**
 * 删除用户
 * ====================
 * @param <String> erp ERP
 */
module.exports =function(req, res) {
	let erp = req.body.erp;
	if(!erp) {
		res.sendStatus(400);
	} else {
		db.User.findOneAndRemove({erp:erp}, function(err, doc, result) {
			if(err) {
				throw err;
				res.sendStatus(500);
			} else if(result.nModified>0) {
				res.sendStatus(200);
			} else {
				res.sendStatus(400);
			}
		});
	}
}