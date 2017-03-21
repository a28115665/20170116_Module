module.exports = {
    SessionCheck: function(req, res, next) {
    	if(req.session.key === undefined) {
    		res.status(404).sendfile('./public/404.html');
    		return;
    	}else{
			next();
    	}

		// if(req.session == null){
		// 	// 使用者尚未登入
		// 	res.sendfile('./public/main.html');
		// 	// res.redirect('/login');
		// 	console.log('失敗');
		// 	return;
		// }
		// console.log('成功');

	}
};