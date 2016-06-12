'use strict';

const
	mongoose = require('mongoose'),
	db = require('../../database/index.js');

module.exports = function(req, res) {
	let did = mongoose.Types.ObjectId( req.body.did );
	let comment = req.body.comment;	//也许以后会用上
	let handle = Number.parseInt( req.body.handle );
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

		db.Demand.update({_id: did}, {$set: upobj, $push:{'news':news}}, {new: true}, function (err, result) {
			if(err) {
				console.log(err);
				res.sendStatus(500);
			} else {
				res.json(news);
			}
		});
	}
}