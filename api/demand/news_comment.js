'use strict';

const
	mongoose = require('mongoose'),
	db = require('../../database/index.js');

/**
 * 需求评论
 * ====================
 * @param <String> did 需求id
 * @param <Html String> comment 评论内容
 */
module.exports = function(req, res) {
	let did = mongoose.Types.ObjectId( req.body.did );
	let comment = req.body.comment;
	if(did && comment) {
		let news = {
			type: 1,
			comment: comment,
			user: req.session._id || null,
			date: new Date()
		};
		db.Demand.update({_id: did}, {$push: {'news': news}}, function(err, result) {
			if(err) {
				throw err;
				res.sendStatus(500);
			} else if(result.nModified>0) {
				res.json(news);
			} else {
				res.sendStatus(400);
			}
		});
	} else {
		res.sendStatus(400);
	}
}