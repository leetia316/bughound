'use strict';

const
	mongoose = require('mongoose'),
	db = require('../../database/index.js');

/**
 * 查询需求byid
 * ====================
 * @param <String> did 需求id
 */
module.exports = function(req, res) {
	let did = mongoose.Types.ObjectId( req.query.did );
	db.Demand.findById( did )
		.populate('files')
		.populate('sbu')
		.populate({
			path: 'news',
			populate: [{ path: 'user', model: 'User'},{ path: 'files', model: 'File'}]
		})
		.exec(function (err, doc) {
			if(err) {
				throw err;
				res.sendStatus(500);
			} else if(!doc) {
				res.sendStatus(404);
			} else {
				res.send(doc);
			}
		});
}