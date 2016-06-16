'use strict';

const
	db = require('../../database/index.js');

/**
 * 需求列表-截断（更人性）
 * ====================
 * @desc 计算数量的那段跟查询那段好像有点冗余了，早晚干掉它
 *
 * @param [String] select 选择字段 etc.多个字段用空格分开，遵循API写法
 * @param [Number Array] states 需求的状态数组
 * @param [String] sbu 业务ID精确匹配
 * @param [Number] skip 跳过个数
 * @param [Number] limi 限制个数
 * @param [Boolean] count 是否计数
 * @param [Bollean] mine 是否我的需求
 */
module.exports = function(req, res) {
	let select = req.body.select;
	let states = req.body.states;
	let sbu = req.body.sbu;
	let limit = req.body.limit;
	let skip = req.body.skip;
	let count = !!req.body.count;
	let mine = !!req.body.mine;
		
	new Promise(function(resolve) {
		// Count = 除去 [skip, limit] 其余条件组合取得的数量
		if(count) {
			let query =  db.Demand.find({})
				.populate('sbu')
				.populate({
					path: 'news',
					populate: { path: 'files', model: 'File'}
				})
				.sort({'updatedAt': -1});
			
			if(mine && req.session._id) {
				query.where('solver').equals(req.session._id)
			}
			if(states && (states instanceof Array) && states.length>0 ) {
				query.where('state').in(states)
			}
			if(sbu && typeof(sbu.trim)==='function') {
				query.where('sbu').equals(sbu.trim());
			}
			if(select && typeof(select.trim)==='function') {
				query.select( select.trim() );
			}

			query.count(function(err, count) {
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
		let query =  db.Demand.find({})
			.populate('sbu')
			.populate({
				path: 'news',
				populate: { path: 'files', model: 'File'}
			})
			.sort({'updatedAt': -1});

		if(mine && req.session._id) {
			query.where('solver').equals(req.session._id)
		}
		if(states && (states instanceof Array) && states.length>0 ) {
			query.where('state').in(states)
		}
		if(sbu && typeof(sbu.trim)==='function') {
			query.where('sbu').equals(sbu.trim());
		}
		if(select && typeof(select.trim)==='function') {
			query.select( select.trim() );
		}
		if(skip && Number.isInteger(skip)) {
			query.skip( skip );
		}
		if(limit && Number.isInteger(limit)) {
			query.limit( limit );
		}

		query.exec(function (err, docs) {
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