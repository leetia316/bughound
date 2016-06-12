'use strict';

const
	fs = require('fs'),
	path = require('path'),
	mongoose = require('mongoose'),
	db = require('../../database/index.js'),
	conf = require('../../config.js');

module.exports = function(req, res) {
	let did = mongoose.Types.ObjectId( req.body.did );
	let files = req.body.files && req.body.files.length && req.body.files.length>0 ? req.body.files : [];
	if(did && files.length>0) {
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
			let news = {
				type: 2,
				files: files,
				user: req.session._id || null,
				date: new Date()
			};

			db.Demand.update({_id: did}, {$push: {'news': news}}, {new: true}, function(err, result) {
				if(err) {
					console.log(err);
					res.sendStatus(500);
				} else {
					res.json(news);
				}
			});
		});
	} else {
		res.sendStatus(404);
	}
}