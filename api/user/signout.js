'use strict';

const
	db = require('../../database/index.js');

module.exports =function(req, res) {
	req.session.erp = null;
	req.session.name = null;
	req.session.isadmin = null;
	res.sendStatus(200);
}