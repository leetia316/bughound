'use strict';

const
	mongoose = require('mongoose'),
	db = require('../../database/index.js');

/**
 * 需求处理
 * ====================
 * @param <String> did 需求id
 * @param <Number> handle 处理类型 etc.0=驳回，1=完成
 * @param [Html String] comment 评论内容 etc.暂时用不上
 */
module.exports = function(req, res) {
	let did = mongoose.Types.ObjectId( req.body.did );
	let handle = Number.parseInt( req.body.handle );
	let comment = req.body.comment;	//也许以后会用上

	let solver = req.session._id;

	if(did && !Number.isNaN(handle) && (handle===0 || handle===1)) {
		let upobj = { state: handle };
		let news = {
			type: 3,
			comment: comment,
			handle: handle,
			user: solver,
			date: new Date()
		};

		//解决且解决的人有登录
		if(handle===1) {
			if(!solver) {
				res.sendStatus(401);
				return;
			} else {
				upobj.solver = solver;
			}
		}

		db.Demand.update({_id: did}, {$set: upobj, $push:{'news':news}}, function (err, result) {
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