'use strict';

const
	mongoose = require('mongoose'),
	db = require('../../database/index.js');

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
		db.Demand.update({_id: did}, {$push: {'news': news}}, {new: true}, function(err, result) {
			if(err) {
				console.log(err);
				res.sendStatus(500);
			} else {
				res.json(news);
			}
		});
	} else {
		res.sendStatus(404);
	}
}