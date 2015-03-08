var crypto = require('crypto'),
    User = require('../models/user.js')
    ,Post = require('../models/post.js');
var express = require('express');
var router = express.Router();



module.exports = function(app) {


  //首页
  app.get('/', function (req, res) {
    res.render('index', { 

    	title: '主页' ,
    	user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()



    });
  });


 //话题
 app.get('/topic',function(req,res){

 	Post.get(null, function(err,posts){

 		if(err){
 			posts=[];
 		}
 

 	res.render('topic/topic',{
 		title:'话题',
 		user: req.session.user,
 		posts: posts,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
 	});
 });
});

 app.post('/post',function(req,res){
 	var currentUser=req.session.user,
 	post=new Post(currentUser.name,req.body.title,req.body.post);
 	post.save(function(err){
 		if(err){
 			req.flash('error',err);
 			return res.redirect('/topic');
 		}
 		req.flash('success','发布成功！');
 		res.redirect('/topic');
 	});
 });


 //提交注册信息

 app.post('/reg',function (req,res) {

 	var name=req.body.name,
 	    password=req.body.password,
 	    password_re=req.body['password-repeat'];

 	    if(password_re!=password){
 	    	req.flash('error','两次输入的密码不一致！');
 	    }

 	var md5=crypto.createHash('md5'),
 	    password=md5.update(req.body.password).digest('hex');
 	var newUser=new User({
 		name: name,
 		password:password,
 		email:req.body.email
 	});


 	//检查用户名是否已经存在

 	User.get(newUser.name,function(err,user){
 		if(err){
 			req.flash('error',err);
 			return res.redirect('/');
 		}
 		if(user){
 			req.flash('error','用户已存在！');
 		}


 		newUser.save(function(err,user){
 			if(err){
 				req.flash('error',err);
 			}
 			req.session.user=user;
 			req.flash('success','注册成功！');
 			res.redirect('/');
 		});
 	});
 });



app.post('/login', function (req, res) {
  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  //检查用户是否存在
  User.get(req.body.name, function (err, user) {
    if (!user) {
      req.flash('error', '用户不存在!'); 
    }
    //检查密码是否一致
    if (user.password != password) {
      req.flash('error', '密码错误!'); 
 
    }
    //用户名密码都匹配后，将用户信息存入 session
    req.session.user = user;
    req.flash('success', '登陆成功!');
    res.redirect('/');//登陆成功后跳转到主页
  });
});


app.get('/logout', function (req, res) {
  req.session.user = null;
  req.flash('success', '登出成功!');
  res.redirect('/');//登出成功后跳转到主页
});



};




function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登录!'); 
    res.redirect('back');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录!'); 
    res.redirect('back');//返回之前的页面
  }
  next();
}