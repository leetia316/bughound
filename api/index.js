'use strict';

module.exports = {
	user: {
		add: require('./user/add'),
		del: require('./user/del'),
		list: require('./user/list'),
		signin: require('./user/signin'),
		signout: require('./user/signout')
	},
	demand: {
		add: require('./demand/add'),
		list: require('./demand/list'),
		get: require('./demand/get'),
		update: require('./demand/update')
	},
}