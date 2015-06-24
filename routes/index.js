var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index');
});

router.get('/css/:file?', function(req, res) {
	var file = req.params.file;
	!file && (file = 'index');
	res.render('css/' + file);
});

router.get('/js/:file?', function(req, res) {
	var file = req.params.file;
	!file && (file = 'index');
	res.render('js/' + file);
});

router.post('/upload', function(req, res) {
	try{
	// 	console.log(req);
		console.log(req.files);
	// 	console.log(req.body);
	// 	console.log(req.params);
	// 	var fileName = req.body.fileName;
	// 	var data = req.body.fileData;
	// 	var savePath = req.body.savePath || 'upload';
	// 	var fs = require('fs');
	// 	var path = require('path');

	// 	fs.writeFileSync(path.join('public', savePath, fileName), new Buffer(data, 'binary'), {flag: 'a'});

		var file = {savePath: '/upload/' + req.files.file.path, flag: true};
		console.log(file);
		res.send(file);
	}
	catch(err){
		console.log(err);
	}
});

module.exports = router;
