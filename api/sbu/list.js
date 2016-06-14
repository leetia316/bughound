'use strict';

const
	db = require('../../database/index.js');

/**
 * 业务列表
 * ====================
 */
module.exports = function(req, res) {
	db.Demand
		.aggregate()
		.group( { _id: '$sbu', count: {$sum: 1} } )
		.lookup( { from: 'sbus', localField:'_id', foreignField:'_id', as:'_id' } )
		.exec(function(err, result) { 
			if(err) {
				console.error(err);
				res.sendStatus(500);
			} else {
				result.forEach(function(item) {
					Object.assign(item, item._id[0]);
				});
				res.send(result);
			}
		});
}