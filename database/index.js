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

let fileSchema = new Schema({
	name:String, oname:String, size:Number, type:String
});

let demandSchema = new Schema({
	title: {type:String, required:true, trim:true},
	desc: String,
	files: [{ type:Schema.Types.ObjectId, ref:'File' }],
	sbu: {type: Schema.Types.ObjectId, ref: 'Sbu'},	//业务

	news: [{ type:Schema.Types.ObjectId, ref:'News' }],

	env: {
		width: Number,
		height: Number,
		dpr: Number,
		ua: String
	},
	
	state: {type: Number, required:true, default:0}, //状态 0=未解决 1=解决
	solver: {type: Schema.Types.ObjectId, ref: 'User'},
	solvedate: Date		//解决时间
						//提交时间=创建时间
}, { timestamps: true });

// strategic business unit (SBU)
let sbuSchema = new Schema({
	name: {type:String, required:true, trim:true, minlength:1, maxlength:100, unique: true}
});

// 动态
let newsSchema = new Schema({
	// demand: { type:Schema.Types.ObjectId, ref:'Demand', required:true },
	type: { type:Number, required:true, min:1, max:3 },	//操作类型：1=普通评论，2=文件上传，3=需求处理

	comment: String,	//评论内容
	
	files: [{ type:Schema.Types.ObjectId, ref:'File' }],
	
	handle: { type:Number },	//需求处理类型，1=解决
	
	user: { type:Schema.Types.ObjectId, ref:'User' }
}, { timestamps: true });

let User = mongoose.model('User', userSchema);
let File = mongoose.model('File', fileSchema);
let Demand = mongoose.model('Demand', demandSchema);
let Sbu = mongoose.model('Sbu', sbuSchema);
let News = mongoose.model('News', newsSchema);

exports.User = User;
exports.File = File;
exports.Demand = Demand;
exports.Sbu = Sbu;
exports.News = News;