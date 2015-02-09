var express = require('express');
var router = express.Router();

// database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/demoApp');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/userslist', function(req, res) {
	var collection = db.get('user');
	collection.find({}, {}, function(e, docs) {
		res.send(docs);
	})
});

router.post('/signin', function(req, res) {
	var paramReq = req.param('data');
	var userName = paramReq.userName;
	var password = paramReq.password;
	var objRes = {};
	// console.log(paramReq);
	var userCollection = db.get('user');
	userCollection.find({}, {}, function(e, docs) {
		var iLen = docs.length;
		console.log('user.length:' + iLen);
		if(iLen <= 0) {
			console.log('没有用户信息！');
			objRes.status = 0;
			objRes.msg = '没有用户信息！';
		} else {
			for(var i=0; i<iLen; i++) {
				if(docs[i].userName == userName && docs[i].password == password) {
					console.log('验证通过！用户名为：' + userName);
					objRes.status = 1;
					objRes.msg = '验证通过！用户名为：' + userName;
					objRes.data = docs[i];
					break;
				} else {
					objRes.status = 0;
					objRes.msg = '验证失败！用户名为：' + userName;
				}
			}
		}

		console.log(objRes);

		res.send(objRes);
	})
});

module.exports = router;
