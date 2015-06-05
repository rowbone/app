var express = require('express');
var router = express.Router();

router.post('/dataGenerate', function(req, res) {
	console.log(req.param('data'));
	res.send('aaaaaaaaaaaaaaa');
});

module.exports = router;