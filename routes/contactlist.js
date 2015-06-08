var express = require('express');
var router = express.Router();

var fs = require('fs')

router.post('/', function(req, res) {
	console.log('in contactlist router');
	fs.readFile('./app/data/bz/home/contactlist-new/user-unit-info.json', 'utf-8', 
		function(err, data) {
			if(err)	throw err;
			console.log('data-->', data);
			res.send(data);
		});
});

module.exports = router;