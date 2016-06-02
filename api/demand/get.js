'use strict';

const
	db = require('../../database/index.js');

module.exports = function(req, res) {
	let _id = req.query.id;
	db.Demand.findById(_id)
		.populate('files')
		.populate('sbu')
		.exec(function (err, doc) {
			if(err) {
				res.sendStatus(500);
			} else if(!doc) {
				res.sendStatus(404);
			} else {
				res.send(doc);
			}
		});
}