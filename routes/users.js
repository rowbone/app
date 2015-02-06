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
	var objRes = {};
	// console.log(paramReq);
	var userCollection = db.get('user');
	userCollection.find({}, {}, function(e, docs) {
		var iLen = docs.length;
		if(iLen <= 0) {
			console.log('没有用户信息！');
		} else {
			for(var i=0; i<iLen; i++) {
				if(docs[i].userName == paramReq.userName && docs[i].password == paramReq.password) {
					console.log('验证通过，用户名为：' + paramReq.userName);
					objRes.status = 1;
					objRes.data = docs[i];
					break;
				} else {
					objRes.status = 0;
				}
			}
		}

		res.send(objRes);
	})
})

module.exports = router;
