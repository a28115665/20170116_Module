var express = require('express');
var router = express.Router();

var middleware = require('./middleware');

/* GET home page. */
router.get('/', function (req, res){
	res.sendfile('./public/main.html');
    // res.redirect('/#/dashboard');
});

module.exports = router;
