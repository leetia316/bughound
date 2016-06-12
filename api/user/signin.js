'use strict';

const
	db = require('../../database/index.js');

/**
 * 用户登录
 * ====================
 * @param <String> erp ERP
 */
module.exports =function(req, res) {
	let erp = req.body.erp;

	if(erp) {
		db.User.findOne({erp:erp}, function (err, doc) {
			if(err) {
				throw err;
				res.sendStatus(500);
			} else if(!doc) {
				res.json({state:'fail', msg:'用户不存在'});
			} else {
				req.session._id = doc._id;
				req.session.erp = doc.erp;
				req.session.name = doc.name;
				req.session.isadmin = doc.isadmin;
				res.json({state:'success', user: doc});
			}
		});
	} else {
		res.sendStatus(400);
	}
}