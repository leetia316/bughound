var fs = require('fs'),
	http = require('http'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	pool = require('mysql').createPool({
		connectionLimit: 100,
		queueLimit: 20,
		host: 'localhost',
		user: 'root',
		password: '',
		database : 'bughound',
		charset : 'utf8_general_ci'
	}),


	multer = require('multer'),
	uploader = multer({
		// dest: 'upload'
		storage: multer.diskStorage({
			destination: function(req, file, cb) {
				cb(null, 'upload')
			},
			filename: function(req, file, cb) {
				var now = new Date();
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
	}),

	express = require('express'),
	app = express();

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
	// 解析POST请求参数必需
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

// 发现这几行只能放在身份验证后面
app.use(express.static(__dirname + '/app'));
app.use('/upload', express.static(__dirname+'/upload'));


/*-----------------------
   API
 ------------------------*/
 	app.post('/api/bug/add', function(req, res) {
 		var width = req.body.width || 0,
 			height = req.body.height || 0,
 			dpr = req.body.dpr || 0,
 			ua = req.body.ua || '',
 			pics = req.body.pics&&req.body.pics.length>0 ? JSON.stringify(req.body.pics) : null,
 			ptit = req.body.ptit || null,
 			purl = req.body.purl || null,
 			business = req.body.business || null,
 			description = req.body.description || null;
 		pool.getConnection(function(err, conn) {
 			if(err) throw err;
 			conn.query('INSERT INTO bug (width, height, dpr, ua, pics, ptit, purl, business, description) VALUES (?,?,?,?,?,?,?,?,?)', [width, height, dpr, ua, pics, ptit, purl, business, description], function(err, result) {
 				if(err) throw err;
 				if(result.affectedRows>0) {
 					conn.query('SELECT LAST_INSERT_ID()', function(err, rows, fields) {
 						if(err) throw err;
 						res.send(rows[0]['LAST_INSERT_ID()'].toString());
 						conn.release();
 					});
 				}
 			});
 		});
 	});
 	app.get('/api/bug/list', function(req, res) {
 		pool.getConnection(function(err, conn) {
 			if(err) throw err;
 			conn.query('SELECT * FROM bug ORDER BY id DESC', function(err, rows, fields) {
 				if(err) throw err;
 				res.send(rows);
 				conn.release();
 			});
 		});
 	});
 	app.get('/api/bug/getbyid', function(req, res) {
 		var id = req.query.id;
 		if(id) {
 			pool.getConnection(function(err, conn) {
 				if(err) throw err;
 				conn.query('SELECT * FROM bug WHERE id=?', [id], function(err, rows, fields) {
 					if(err) throw err;
 					rows.length>0? res.send(rows[0]) : res.send(null);
 					conn.release();
 				});
 			});
 		}
 	});
 	app.post('/api/bug/update', function(req, res) {
 		var id = parseInt(req.body.id),
 			solver = req.body.solver || null,
 			state = parseInt(req.body.state);
 		if(!isNaN(id) && !isNaN(state)) {
 			pool.getConnection(function(err, conn) {
 				if(err) throw err;
 				conn.query('UPDATE bug SET solver=?, state=? WHERE id=?', [solver, state, id], function(err, result) {
 					if(err) throw err;
					if(result.affectedRows>0) {
						res.sendStatus(200);
					}
 				});
 			});
 		}
 	});
 	app.post('/api/user/add', function(req, res) {
 		var erp = req.body.erp,
 			name = req.body.name;
 		if(erp && name) {
 			pool.getConnection(function(err, conn) {
 				if(err) throw err;
 				conn.query('INSERT INTO user (erp, name) VALUES (?,?)', [erp, name], function(err, result) {
 					if(err) throw err;
 					if(result.affectedRows>0) {
 						res.send({erp:erp, name:name});
 					}
 				});
 			});
 		}
 	});
 	app.post('/api/user/del', function(req, res) {
 		var erp = req.body.erp;
 		if(erp) {
 			pool.getConnection(function(err, conn) {
 				if(err) throw err;
 				conn.query('DELETE FROM user WHERE erp=?', [erp], function(err, result) {
 					if(err) throw err;
 					if(result.affectedRows>0) {
 						res.sendStatus(200);
 					}
 				});
 			});
 		}
 	});
 	app.post('/api/user/update', function(req, res) {
 		var erp = req.body.erp,
 			name = req.body.name;
 		if(erp && name) {
 			pool.getConnection(function(err, conn) {
 				if(err) throw err;
 				conn.query('UPDATE user SET name=? WHERE erp=?', [name, erp], function(err, result) {
 					if(err) throw err;
 					if(result.affectedRows>0) {
 						res.sendStatus(200);
 					}
 					conn.release();
 				});
 			});
 		}
 	});
 	app.get('/api/user/list', function(req, res) {
 		pool.getConnection(function(err, conn) {
 			if(err) throw err;
 			conn.query('SELECT * FROM user', function(err, rows, fields) {
 				if(err) throw err;
 				res.send(rows);
 				conn.release();
 			});
 		});
 	});
//-----Oth-----
	app.post('/api/upload', uploader.single('pic'), function(req, res) {
		res.send(req.file.filename);
	});

// ----------------------------------------------- //
var server = app.listen(8088, function() {
	console.log('UFT Server Listening on port %d', server.address().port);
});