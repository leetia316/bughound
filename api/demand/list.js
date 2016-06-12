'use strict';

const
	db = require('../../database/index.js');

module.exports = function(req, res) {
	db.Demand.find({})
		.populate('sbu')
		.populate({
			path: 'news',
			populate: { path: 'files', model: 'File'}
		})
		.sort({'createdAt': -1})
		.exec(function (err, docs) {
			if(err) {
				res.sendStatus(500);
			} else {
				res.send(docs);
			}
		});
}