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
	sbu: {
		add: require('./sbu/add'),
		list: require('./sbu/list'),
		search: require('./sbu/search')
	},
	news: {
		add: require('./news/add'),
		upload: require('./news/upload'),
		get: require('./news/get')
	}
}