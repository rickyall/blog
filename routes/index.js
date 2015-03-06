

module.exports = function(app){



//主页
	app.get('/',function(req,res){
		res.render('index',{title:'主页'});
	});



//注册页
	app.get('/reg',function(req,res){
		res.render('reg',{title:'注册'});
	});

//注册POST页
	app.post('/reg',function(req,res){
	});



//登录页
	app.get('/login',function(req,res){
		res.render('login',{title:'登录'});
	});


//登录POST页
	app.post('/login',function(req,res){
	});


//发表页
	app.get('/post',function(req,res){
		res.render('post',{title:'发表'});
	});


//发表POST
	app.post('/post',function(req,res){
	});


//登出页
	app.get('/logout',function(req,res){
	});

};
