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

	env: {
		width: Number,
		height: Number,
		dpr: Number,
		ua: String
	},
	
	state: {type: Number, required:true, default:0}, //状态
	solver: {type: Schema.Types.ObjectId, ref: 'User'},
	solvedate: Date		//解决时间
						//提交时间=创建时间
}, { timestamps: true });

let User = mongoose.model('User', userSchema);
let File = mongoose.model('File', fileSchema);
let Demand = mongoose.model('Demand', demandSchema);

exports.User = User;
exports.File = File;
exports.Demand = Demand;