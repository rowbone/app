var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
	console.log('name-->', req.param('name'));
	console.log('age-->', req.param('age'));
	res.send({
		success: false,
		obj: {
			sex: 'male'
		}
	});
});

router.post('/error', function(req, res) {
	console.log('name-->', req.param('name'));

	res.send({
		success: false,
		obj: null
	});
});

module.exports = router;

