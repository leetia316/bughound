'use strict';

const
	mongoose = require('mongoose'),
	db = require('../../database/index.js');

module.exports = function(req, res) {
	let demand = mongoose.Types.ObjectId( req.body.demand );
	let type = req.body.type;
	let comment = req.body.comment;
	let handle = req.body.handle;
	if(demand && type && (type==1 || type==3)) {
		let news = new db.News({
			type: type,
			comment: comment,
			handle: handle,
			user: req.session._id || null
		});
		news.save(function(err) {
			if(err) throw err;
			db.Demand.findById(demand, function(err, d) {
				if(err) throw err;
				d.news.push(news);
				d.save(function(err) {
					if(err) throw err;
					res.json(news);
				});
			});
		});
	} else {
		res.sendStatus(404);
	}
}