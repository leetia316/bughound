'use strict';

const
	db = require('../../database/index.js');

module.exports =function(req, res) {
	let erp = req.body.erp;

	if(erp) {
		db.User.findOne({erp:erp}, function (err, doc) {
			if(err) {
				res.sendStatus(500);
			} else if(!doc) {
				// res.sendStatus(404);
				res.json({state:'fail'});
			} else {
				req.session.erp = doc.erp;
				req.session.name = doc.name;
				req.session.isadmin = doc.isadmin;
				res.json({state:'success', data: {erp:doc.erp, name:doc.name, email:doc.email, isadmin:doc.isadmin}});
			}
		});
	}
}