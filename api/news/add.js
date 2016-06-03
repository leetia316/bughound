'use strict';

const
	db = require('../../database/index.js');

module.exports = function(req, res) {
	let demand = req.body.demand;
	let type = req.body.type;
	let comment = req.body.comment;
	let handle = req.body.handle;
	if(demand && type && (type==1 || type==3)) {
		let news = new db.News({
			demand: demand,
			type: type,
			comment: comment,
			handle: handle,
			user: req.session._id || null
		});
		news.save(function(err) {
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