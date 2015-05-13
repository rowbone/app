var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
	console.log(req.params);
	console.log(req.param('name'))
	res.send({
		'sex': 'male'
	});
});

module.exports = router;

