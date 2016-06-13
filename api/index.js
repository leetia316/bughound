'use strict';

module.exports = {
	user: {
		add: require('./user/add'),
		del: require('./user/del'),
		list: require('./user/list'),
		update: require('./user/update'),
		signin: require('./user/signin'),
		signout: require('./user/signout')
	},
	demand: {
		add: require('./demand/add'),
		list: require('./demand/list'),
		get: require('./demand/get'),
		newsComment: require('./demand/news_comment'),
		newsUpload: require('./demand/news_upload'),
		newsHandle: require('./demand/news_handle')
	},
	sbu: {
		add: require('./sbu/add'),
		list: require('./sbu/list'),
		search: require('./sbu/search'),
		rename: require('./sbu/rename')
	}
}