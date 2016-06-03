'use strict';

const
	db = require('../../database/index.js');

module.exports = function(req, res) {
	let demand = req.query.demand;
	db.News.find({demand:demand})
		.populate('user')
		.populate('files')
		.exec(function (err, docs) {
			if(err) {
				res.sendStatus(500);
			} else if(!docs) {
				res.sendStatus(404);
			} else {
				res.send(docs);
			}
		});
}