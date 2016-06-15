'use strict';

const
	db = require('../../database/index.js');

/**
 * 需求列表-截断（更人性）
 * ====================
 * @param [Number] limi 限制个数
 * @param [String] select 选择字段 etc.多个字段用空格分开，遵循API写法
 * @param [Number] skip 跳过个数
 * @param [Boolean] count 是否计数
 */
module.exports = function(req, res) {
	let limit = Number.parseInt(req.query.limit);
	let select = req.query.select;
	let skip = Number.parseInt(req.query.skip);
	let count = !!req.query.count;
		
	limit = limit && Number.isInteger(limit) ? limit : 0;
	select = select && typeof(select.trim)==='function' ? select.trim() : '';
	skip = skip && Number.isInteger(skip) ? skip : 0;
	
	new Promise(function(resolve) {
		if(count) {
			db.Demand.count({}, function(err, count) {
				if(err) {
					reject(err);
				} else {
					resolve(count);
				}
			});
		} else {
			resolve();
		}
	}).then(function(count) {
		db.Demand.find({})
			.populate('sbu')
			.populate({
				path: 'news',
				populate: { path: 'files', model: 'File'}
			})
			.sort({'updatedAt': -1})
			.skip(skip)
			.limit(limit)
			.select(select)
			.exec(function (err, docs) {
				if(err) {
					throw new Error(err);
				} else {
					if(Number.isInteger(count)) {
						res.json({demands: docs, count: count});
					} else {
						res.json({demands: docs});
					}
				}
			});
	}).catch(function(err) {
		console.error(err);
		res.sendStatus(500);
	});
}