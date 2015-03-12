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

var func = function(res, msg) {
	res.send(msg)
}
router.get('/userCheck', function(req, res) {

	var username = req.param('username');
	console.log('username==' + username);
	if(username == 'user1' || username == 'user2') {
		setTimeout(func(res, 'true'), 5000);
	} else {
		setTimeout(func(res, 'false'), 5000);
	}
});

router.post('/userDel', function(req, res) {
	var paramReq = req.param('data');
	var userName = paramReq.username;
	var objRes = {};

	if(paramReq == {}) {
		objRes.success = false;
		objRes.message = '没有传入对应的用户信息！';
		res.send(objRes);
	}

	var userCollection = db.get('user');
	userCollection.find({}, {}, function(e, docs) {
		var iLen = docs.length;
		if(iLen <= 0) {
			objRes.success = false;
			objRes.message = '没有用户信息！';
		} else {
			for(var i=0; i<iLen; i++) {
				if(docs[i].userName == userName) {
					objRes.success = true;
					objRes.message = '删除用户信息成功！用户名为：' + userName;
					objRes.obj = docs[i];
					break;
				}
			}

			if(!objRes.success) {
				objRes.success = false;
				objRes.message = '未获取到对应的用户信息！用户名为：' + userName;
			}
		}

		res.send(objRes);
	});
})

router.post('/signin', function(req, res) {
	console.log('testing.......................');
	var paramReq = req.param('data');
	var userName = paramReq.userName;
	var password = paramReq.password;
	var objRes = {};
	// console.log(paramReq);

	if(paramReq == {}) {
		objRes.success = false;
		objRes.message = '没有传入对应的用户信息！';
		res.send(objRes);
	}

	var userCollection = db.get('user');
	userCollection.find({}, {}, function(e, docs) {
		var iLen = docs.length;
		console.log('user.length:' + iLen);
		if(iLen <= 0) {
			console.log('没有用户信息！');
			objRes.success = false;
			objRes.message = '没有用户信息！';
		} else {
			for(var i=0; i<iLen; i++) {
				if(docs[i].userName == userName && docs[i].password == password) {
					console.log('验证通过！用户名为：' + userName);
					objRes.success = true;
					objRes.message = '验证通过！用户名为：' + userName;
					objRes.obj = docs[i];
					break;
				} else {
					objRes.success = false;
					objRes.message = '验证失败！用户名为：' + userName;
				}
			}
		}

		console.log(objRes);

		res.send(objRes);
	})
});

module.exports = router;
