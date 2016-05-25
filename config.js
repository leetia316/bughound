'use strict';

module.exports = {
	// 运行端口
	port: 8088 || process.env.PORT,

	// 数据库
	mongodb: {
		// 'mongodb://username:password@host:port/database?options'
		uri: 'mongodb://localhost/bh2',
		// 详查http://mongoosejs.com/docs/connections.html
		options: {}
	},

	// 文件存储路径
	updir: 'upload'
}