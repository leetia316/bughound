'use strict';

const
	fs = require('fs'),
	path = require('path'),
	db = require('../../database/index.js'),
	conf = require('../../config.js');

module.exports = function(req, res) {
	let title = req.body.title;
	let desc = req.body.desc || null;
	let files = req.body.files && req.body.files.length && req.body.files.length>0 ? req.body.files : [];

	// ENV
	let width = req.body.width || 0;
	let height = req.body.height || 0;
	let dpr = req.body.dpr || 0;
	let ua = req.body.ua || '';

	if(!title) {
		res.sendStatus(404);
	} else {
		// 文件转移
		files.forEach(function(item) {
			let sf = path.join(conf.tmpdir, item.name);
			let df = path.join(conf.updir, item.name);
			let rs = fs.createReadStream(sf);
			let ws = fs.createWriteStream(df);
			rs.pipe(ws);
			rs.on('end', function() {
				fs.unlink(sf, function(err) {
					if(err) throw err;
				});
			});
		});

		db.File.create(files, function(err, files) {
			if(err) throw err;
			// Document
			let demand = new db.Demand({
				title: title,
				desc: desc,
				files: files,
				env: {
					width: width,
					height: height,
					dpr: dpr,
					ua: ua
				}
			});
			// Save
			demand.save(function(err) {
				if(err) {
					console.log(err)
					res.sendStatus(500);
				} else {
					res.send(demand.get('id'));
				}
			});
		});
	}
}