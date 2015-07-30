var express = require('express');
var router = express.Router();

var fs = require('fs');


router.get('/', function(req, res) {
	console.log(req.param('name'));

	res.send('11111111111111');
});

router.get('/scroll', function(req, res) {
	console.log(req.param('name'));
	var user = {};
	var data = [];
	for(var i=0; i<100; i++) {
		user = {
			'id': i, 
			'name': 'name' + i,
			'age': 100 - i
		};

		data.push(user);
	}

	fs.writeFile('./app/data/test/iscroll/all-data.json', JSON.stringify(data), function(err, data) {
		if(err) {
			console.error(err);
		}
		console.log('data-->', data);
	});

	res.send('222222222222222');
});

router.get('/users', function(req, res) {
	fs.readFile('./app/views/components/conow-responsive-table/data/users.json', {encoding: 'UTF-8'},
		function(err, data) {
			if(err)	throw err;
			data = JSON.parse(data);
			var random = parseInt(10 * Math.random(0, 1));
      if(random % 2) {
        data.unshift({'name': 'abc', 'age': 3});
      } else {
        data.unshift({'name': 'aaa', 'age': 2});
      }
      
			res.send(JSON.stringify(data));
		});

})

module.exports = router;