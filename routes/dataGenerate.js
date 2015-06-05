var express = require('express');
var router = express.Router();

var fs = require('fs');

var fileData = fs.readFile('../app/data/test/iscroll/all-date.json', function(err, data) {
	if(err) console.error(err);
	else console.log('data-->>', data);
});


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

	fs.writeFile('app/data/test/iscroll/all-date.json', JSON.stringify(data), function(err, data) {
		if(err) {
			console.error(err);
		}
		console.log('data-->', data);
	});

	res.send('222222222222222');
});

module.exports = router;