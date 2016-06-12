'use strict';

const
	fs = require('fs'),
	path = require('path'),
	mongoose = require('mongoose'),
	db = require('../../database/index.js'),
	conf = require('../../config.js');

/**
 * 需求文件上传
 * ====================
 * @param <String> did 需求id
 * @param <Object Array> files 文件 etc.{name, oname, size, type}
 */
module.exports = function(req, res) {
	let did = mongoose.Types.ObjectId( req.body.did );
	let files = req.body.files && req.body.files.length && req.body.files.length>0 ? req.body.files : [];
	if(did && files.length>0) {
		// 文件转移
		files = files.filter(function(item) {
			if(item.name && item.oname) {
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
				return true;
			} else {
				return false;
			}
		});

		db.File.create(files, function(err, files) {
			if(err) {
				throw err;
				res.sendStatus(500);
			} else {
				let news = {
					type: 2,
					files: files,
					user: req.session._id || null,
					date: new Date()
				};
				
				db.Demand.update({_id: did}, {$push: {'news': news}}, {new: true}, function(err, result) {
					if(err) {
						throw err;
						res.sendStatus(500);
					} else if(result.nModified>0) {
						res.json(news);
					} else {
						res.sendStatus(400);
					}
				});
			}
		});
	} else {
		res.sendStatus(400);
	}
}