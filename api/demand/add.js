'use strict';

const
	fs = require('fs'),
	path = require('path'),
	db = require('../../database/index.js'),
	conf = require('../../config.js');

/**
 * 申请需求
 * ====================
 * @param <String> title 需求标题
 * @param [String] sbu 需求所属业务 etc.sbu与sbustr二必有一
 * @param <String> sbustr 需求所属业务 etc.sbu与sbustr二必有一
 * @param [Html String] desc 需求描述
 * @param [Object Array] files 需求附件 etc.{name, oname, size, type}
 *
 * @param [Number] width 浏览器宽
 * @param [Number] height 浏览器高
 * @param [Number] dpr 设备DPR
 * @param [String] ua 浏览器UA
 */
module.exports = function(req, res) {
	let title = req.body.title;
	let sbu = req.body.sbu;
	let sbustr= req.body.sbustr;
	let desc = req.body.desc || null;
	let files = req.body.files && req.body.files.length && req.body.files.length>0 ? req.body.files : [];

	// ENV
	let width = req.body.width;
	let height = req.body.height;
	let dpr = req.body.dpr;
	let ua = req.body.ua;

	if(!title || (!sbu && !sbustr)) {
		res.sendStatus(400);
	} else {
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
				let condition = {};
				if(sbu) {
					condition._id = sbu;
				} else {
					condition.name = sbustr;
				}
				db.Sbu.findOneAndUpdate(condition, {$setOnInsert:{name:sbustr}}, {new: true, upsert: true}, function(err, doc){
					if(err) {
						throw err;
						res.sendStatus(500);
					} else if(doc) {
						sbu = doc._id;
						// Document
						let demand = new db.Demand({
							title: title,
							desc: desc,
							files: files,
							sbu: sbu,
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
								throw err;
								res.sendStatus(500);
							} else {
								res.send(demand.get('id'));
							}
						});
					} else {
						res.sendStatus(400);
					}
				});
			}
		});
	}
}