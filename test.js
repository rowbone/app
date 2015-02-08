
var mysql = require('mysql');

var test_db = 'ceshi';
var test_table = 'user',

var client = mysql.createConnection({
	user: 'root',
	password: 'password'
});

client.connect();
client.query('user ' + test_db);

client.query('select * from ' + test_table, function selectCb(err, results, fields) {
	if(err) {
		throw err;
	}

	if(results) {
		for(var i=0; i<results.length; i++) {
			console.log('%d\t%s\t%s', results[i].id, results[i].name, results[i].age);
		}
	}
	client.end();
})