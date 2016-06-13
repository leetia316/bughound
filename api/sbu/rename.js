'use strict';

const
	mongoose = require('mongoose'),
	db = require('../../database/index.js');

/**
 * 业务重命名
 * ====================
 * @param <String> sid 业务id
 * @param <String> newname 新名字
 */
module.exports = function(req, res) {
	let sid = mongoose.Types.ObjectId( req.body.sid );
	let newname = req.body.newname;
	if(sid && newname) {
		db.Sbu.update({_id: sid}, {$set: {'name': newname}}, function(err, result) {
			if(err) {
				console.error(err);
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