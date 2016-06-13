'use strict';

const 
	fs = require('fs'),
	path = require('path'),

	express = require('express'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	multer = require('multer'),
	helmet = require('helmet'),
	Ddos = require('ddos'),

	api2 = require('./api/'),
	conf = require('./config.js'),

	app = express();

// Multer 上传器
let uploader = multer({
	// dest: conf.updir
	storage: multer.diskStorage({
		destination: function(req, file, cb) {
			// cb(null, conf.updir)
			cb(null, conf.tmpdir);
		},
		filename: function(req, file, cb) {
			let now = new Date();
			cb(null, now.getFullYear() + 
				('0' + (now.getMonth()+1)).slice(-2) + 
				('0' + now.getDate()).slice(-2) + 
				('0' + now.getHours()).slice(-2) + 
				('0' + now.getMinutes()).slice(-2) + 
				('0' + now.getSeconds()).slice(-2) + 
				('0' + Math.floor(Math.random()*100)).slice(-2)
			)
		}
	})
});

// Ddos
let ddos = new Ddos({
	// maxcount: 30,
	// burst: 5,
	// limit: burst * 4,  
	// maxexpiry: 120,
	// checkinterval: 1,
	// errormessage: 'Error',
	// testmode: false,
	// silent: false,
	// silentStart: false,
	// responseStatus: 429
});

/*-----------------------
   中间件
 ------------------------*/
app.use(session({
	secret: 'uft2015bymanjiz',
	cookie: {maxAge: 1000*60*60*24*15},	// 15 days
	resave: true,
    saveUninitialized: true
}));
app.use(cookieParser());
app.use(helmet());
// app.use(ddos.express);
// 解析POST请求参数必需
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/app'));
app.use('/upload', express.static(__dirname+'/upload'));

/*-----------------------
   API
 ------------------------*/
function requireAdmin(req, res, next) { req.session.isadmin ? next() : res.sendStatus(401); }
function requireSignin(req, res, next) { req.session.erp ? next() : res.sendStatus(401); }

app.post('/api/user/add', ddos.express, requireAdmin, api2.user.add);
app.post('/api/user/del', requireAdmin, api2.user.del);
app.post('/api/user/update', requireAdmin, api2.user.update);
app.get('/api/user/list', api2.user.list);
app.post('/api/user/signin', api2.user.signin);
app.post('/api/user/signout', api2.user.signout);

app.post('/api/demand/add', ddos.express, api2.demand.add);
app.get('/api/demand/list', api2.demand.list);
app.get('/api/demand/get', api2.demand.get);
app.post('/api/demand/news_comment', ddos.express, api2.demand.newsComment);
app.post('/api/demand/news_upload', ddos.express, api2.demand.newsUpload);
app.post('/api/demand/news_handle', api2.demand.newsHandle);
   
app.post('/api/sbu/add', ddos.express, api2.sbu.add);
app.get('/api/sbu/list', api2.sbu.list);
app.get('/api/sbu/search', api2.sbu.search);
app.post('/api/sbu/rename', api2.sbu.rename);

app.get('/api/auth', function(req, res) {
	res.send({_id:req.session._id, erp:req.session.erp, name:req.session.name, isAdmin:!!req.session.isadmin})
});
app.get('/api/attachment/:fname/:oname', function(req, res) {
	let fname = req.params.fname;
	let oname = req.params.oname;
	res.download( path.join(conf.updir, fname), oname );
});
app.post('/api/upload', uploader.single('file'), function(req, res) {
	res.send(req.file.filename);
});

// ----------------------------------------------- //
let server = app.listen(conf.port, function() {
	console.info('UFT Server Listening on port %d', server.address().port);
	console.info('Helmet is protecting your app');
	console.info('-------------------------------');
});