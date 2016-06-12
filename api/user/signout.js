'use strict';

const
	db = require('../../database/index.js');

/**
 * 用户登出
 * ====================
 */
module.exports =function(req, res) {
	req.session._id = null;
	req.session.erp = null;
	req.session.name = null;
	req.session.isadmin = null;
	res.sendStatus(200);
}