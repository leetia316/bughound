'use strict';

const
	mongoose = require('mongoose'),
	conf = require('../config.js');

let Schema = mongoose.Schema;

mongoose.connect(conf.mongodb.uri, conf.mongodb.options);

let userSchema = new Schema({
	erp: {type: String, required:true, unique: true, trim: true},
	pass: {type: String, default: ''},	//密码，现在不用
	name: {type: String, default: '佚名', trim: true},
	email: {type: String, required:true, match: /^[a-zA-Z0-9]*@jd\.com$/, trim: true},
	isadmin: {type: Number, required:true, default: 0}	//管理员，现在不用
}, { timestamps: true });

let demandSchema = new Schema({
	env: {
		width: Number,
		height: Number,
		dpr: Number,
		ua: String
	},
	page: {
		title: String,
		url: String
	},
	pics: [String], //截图+文件
	desc: String, //描述
	state: {type: Number, required:true, default:0}, //状态
	solver: {type: Schema.Types.ObjectId, ref: 'User'},
	solvedate: Date		//解决时间
						//提交时间=创建时间
}, { timestamps: true });

let User = mongoose.model('User', userSchema);
let Demand = mongoose.model('Demand', demandSchema);

exports.Demand = Demand;
exports.User = User;