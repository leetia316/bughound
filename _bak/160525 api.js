var nodemailer = require('nodemailer'),
	pool = require('mysql').createPool({
		connectionLimit: 100,
		queueLimit: 20,
		host: 'localhost',
		user: 'root',
		password: '',
		database : 'bughound',
		charset : 'utf8_general_ci'
	});

// 邮箱配置
var transporter = nodemailer.createTransport({
	service: '163',
	auth: {
		user: 'jdc_fd@163.com',
		pass: 'uliientoslppnlzb'
	}
});

module.exports = function() {
	return {
		bug: {
			add: function(req, res) {
	 			var width = req.body.width || 0,
	 				height = req.body.height || 0,
	 				dpr = req.body.dpr || 0,
	 				ua = req.body.ua || '',
	 				pics = req.body.pics&&req.body.pics.length>0 ? JSON.stringify(req.body.pics) : null,
	 				ptit = req.body.ptit,
	 				purl = req.body.purl,
	 				description = req.body.description || null;
	 			if(ptit && purl) {
	 				pool.getConnection(function(err, conn) {
	 					if(err) throw err;
	 					conn.query('INSERT INTO bug (width, height, dpr, ua, pics, ptit, purl, description) VALUES (?,?,?,?,?,?,?,?)', [width, height, dpr, ua, pics, ptit, purl, description], function(err, result) {
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
	 			}
	 		},
	 		list: function(req, res) {
 				pool.getConnection(function(err, conn) {
 					if(err) throw err;
 					conn.query('SELECT * FROM bug ORDER BY id DESC', function(err, rows, fields) {
 						if(err) throw err;
 						res.send(rows);
 						conn.release();
 					});
 				});
 			},
 			getbyid: function(req, res) {
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
 			},
 			update: function(req, res) {
 				var id = parseInt(req.body.id),
 					solver = req.session.erp,
 					state = parseInt(req.body.state);
 				if(!isNaN(id) && !isNaN(state)) {
 					pool.getConnection(function(err, conn) {
 						if(err) throw err;
 						// 只有操作为解决时才记录solver
 						if(state==1)  {
 							conn.query('UPDATE bug SET solver=?, state=? WHERE id=?', [solver, state, id], function(err, result) {
 								if(err) throw err;
								if(result.affectedRows>0) {
									res.sendStatus(200);
								}
								conn.release();
 							});
 						} else {
 							conn.query('UPDATE bug SET state=? WHERE id=?', [state, id], function(err, result) {
 								if(err) throw err;
								if(result.affectedRows>0) {
									res.sendStatus(200);
								}
								conn.release();
 							});
 						}
 					});
 				}
 			}
		},
		user: {
			add: function(req, res) {
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
 			},
 			del: function(req, res) {
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
 			},
 			update: function(req, res) {
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
 			},
 			list: function(req, res) {
 				pool.getConnection(function(err, conn) {
 					if(err) throw err;
 					conn.query('SELECT * FROM user', function(err, rows, fields) {
 						if(err) throw err;
 						res.send(rows);
 						conn.release();
 					});
 				});
 			},
 			login: function(req, res) {
				var erp = req.body.erp,
					pass = req.body.pass;
				if(erp && pass) {
					pool.getConnection(function(err, conn) {
						if(err) throw err;
						conn.query('SELECT * FROM user WHERE erp=? AND pass=?', [erp, pass], function(err, rows) {
							if(err) throw err;
							if(rows[0]) {
								req.session.erp = rows[0].erp;
								req.session.name = rows[0].name;
								req.session.isadmin = rows[0].isadmin;
								res.json({state:'success', data: {erp:rows[0].erp, name:rows[0].name, email:rows[0].email, isadmin:rows[0].isadmin}});
							} else {
								res.json({state:'fail'});
							}
							conn.release();
						});
					});
				}
			},
 			logout: function(req, res) {
				req.session.erp = null;
				req.session.name = null;
				req.session.isadmin = null;
				res.sendStatus(200);
			},
			getpas: function(req, res) {console.log(req.body.erp)
				if(req.body.erp) {
					pool.getConnection(function(err, conn) {
						if(err) throw err;
						conn.query('SELECT * FROM user WHERE erp=?', [req.body.erp], function(err, rows, fields) {
							if(err) throw err;
							if(rows[0]) {
								transporter.sendMail({
									from: 'JDC多终端研发部<jdc_fd@163.com>',
								   	to: rows[0].email,
								   	subject: '【BugHound】密码找回',
								   	html: '你的密码是：' + rows[0].pass + '<br>登录后你可以在左侧栏修改密码',
								}, function(error, info){
								   	if(error){ return console.log(error); }
								   	console.log('Message sent: ' + info.response);
								   	console.log('>>> \x1b[36mdemand/xxx\x1b[0m::邮件周知已发送');
								});
								res.json({state:'success'});
							} else {
								res.json({state:'fail', msg:'查无此人'});
							}
							conn.release();
						});
						
					});
				}
			}
		},
		oth: {
			upload: function(req, res) {
				res.send(req.file.filename);
			},
			auth: function(req, res) {
				res.send({erp:req.session.erp, name:req.session.name, isAdmin:!!req.session.isadmin})
			}
		}
	}
}