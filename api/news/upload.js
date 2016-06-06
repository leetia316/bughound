'use strict';

const
	fs = require('fs'),
	path = require('path'),
	db = require('../../database/index.js'),
	conf = require('../../config.js');

module.exports = function(req, res) {
	let demand = req.body.demand;
	let files = req.body.files && req.body.files.length && req.body.files.length>0 ? req.body.files : [];
	if(demand && files.length>0) {
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
			let news = new db.News({
				type: 2,
				files: files,
				user: req.session._id || null
			});
			news.save(function(err) {
				if(err) throw err;
				db.Demand.findById(demand, function(err, d) {
					if(err) throw err;
					d.news.push(news);
					d.save(function(err) {
						if(err) throw err;
						res.json(news);
					});
				});
			});
		});
	} else {
		res.sendStatus(404);
	}
}