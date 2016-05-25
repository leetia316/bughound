'use strict';

const
	db = require('../../database/index.js');

module.exports = function(req, res) {
	let width = req.body.width || 0,
		height = req.body.height || 0,
		dpr = req.body.dpr || 0,
		ua = req.body.ua || '',
		pics = req.body.pics && req.body.pics.length && req.body.pics.length>0 ? req.body.pics : null,
		ptit = req.body.ptit,
		purl = req.body.purl,
		description = req.body.description || null;

	if(!description && !pics) {
		res.sendStatus(404);
	} else {
		let demand = new db.Demand({
			env: {
				width: width,
				height: height,
				dpr: dpr,
				ua: ua
			},
			page: {
				title: ptit,
				url: purl
			},
			pics: pics,
			desc: description
		});
	
		demand.save(function(err) {
			if(err) {
				res.sendStatus(500);
			} else {
				res.send(demand.get('id'));
			}
		});
	}
}