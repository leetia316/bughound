'use strict';

const
	db = require('../../database/index.js');

module.exports = function(req, res) {
	let _id = req.body.id;
	let solver = req.session._id;
	let state = Number.parseInt(req.body.state);
	if(_id && !isNaN(state)) {
		let upobj = {state:state};
		//解决且解决的人有登录
		if(state===1 && solver) {
			upobj.solver = solver;
		}
		db.Demand.update({_id:_id}, {$set: upobj}, function (err, doc) {
			if(err) {
				console.log(err);
				res.sendStatus(500);
			} else {
				res.sendStatus(200);
			}
		});
	}
}