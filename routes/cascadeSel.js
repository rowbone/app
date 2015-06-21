var express = require('express');
var router = express.Router();

// ?type=DICT_LEVEL&DICT_CODE=HR_RETIRED_ARMY_RANK

router.post('/common!queryOptions', 
	function(req, res) {
		console.log('type-->', req.param('type'));
		console.log('DICT_CODE-->', req.param('DICT_CODE'));
	});

module.exports = router;