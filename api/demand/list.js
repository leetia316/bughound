'use strict';

const
	db = require('../../database/index.js');

module.exports = function(req, res) {
	// db.Demand.find({}, function (err, docs) {
	// 	if(err) {
	// 		res.sendStatus(500);
	// 	} else {
	// 		res.send(docs);
	// 	}
	// });
	// db.Demand.find({})
	// 	.populate('files')
	// 	.exec(function (err, docs) {
	// 		if(err) {
	// 			res.sendStatus(500);
	// 		} else {
	// 			res.send(docs);
	// 		}
	// 	});
	db.Demand.find({})
		.populate('files')
		.populate('sbu')
		.sort({'createdAt': -1})
		.exec(function (err, docs) {
			if(err) {
				res.sendStatus(500);
			} else {
				res.send(docs);
			}
		});
}