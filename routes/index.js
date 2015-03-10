var crypto = require('crypto'),
    User = require('../models/user.js')
    ,Post = require('../models/post.js'),
    Comment = require('../models/comment.js');
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
  //判断是否是第一页
  var page=req.query.p?parseInt(req.query.p):1;
  
  //查询并返回第page页的10篇文章

 	Post.getTen(null, page, function(err,posts,total){

 		if(err){
 			posts=[];
 	}
 

 	res.render('topic/topic',{
 		title:'话题',
 		user: req.session.user,
 		posts: posts,
    page:page,
    isFirstPage:(page-1)==0,
    isLastPage:((page-1)*10+posts.length)==total,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
 	});
 });
});

 app.post('/post',function(req,res){
  var tag=req.body.tag;
  var tags= new Array(); 
   tags=tag.split(",");
 	var currentUser=req.session.user,
 	post=new Post(currentUser.name,req.body.title,tags,req.body.post);
 	post.save(function(err){
 		if(err){
 			req.flash('error',err);
 			return res.redirect('/topic');
 		}
 		req.flash('success','发布成功！');
 		res.redirect('/topic');
 	});
 });



//标签页

app.get('/tags',function(req,res){

  Post.getTags(function(err,posts){
    if(err){
      req.flash('error',err);
      return res.redirect('back');
    }
    res.render('topic/tags',{
      title:'标签',
      posts:posts,
      user:req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});


//标签文章页
app.get("/tags/:tag",function(req,res){

  Post.getTag(req.params.tag,function(err,posts){
    if(err){
      req.flash('error,err');
      return res.redirect('/');
    }
    res.render('topic/tag',{
      title:'TAG:'+req.params.tag,
      posts:posts,
      user:req.session.user,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()
    });
  });
});





//搜索页面
app.get('/search',function(req,res){
  Post.search(req.query.keyword,function(err,posts){
    if(err){
      req.flash('error',err);
      return res.redirect('/');
    }

    res.render('topic/search',{
      title:"SEARCH:"+req.query.keyword,
      posts:posts,
      user:req.session.user,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()
    });
  });
});









//用户页面路由

app.get('/user/:name',function(req,res){

   var page = req.query.p ? parseInt(req.query.p) : 1;

  //检查用户名是否存在
  User.get(req.params.name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
      return res.redirect('/');
    }

    //查询并返回该用户的第PAGE页的10篇文章


    Post.getTen(user.name,page,function(err,posts,total){
      if(err){
        req.flash('error',err);
        return res.redirect('/');
      }
      res.render('user/user',{
        title:user.name,
        posts:posts,
        page:page,
        isFirstPage:(page-1)==0,
        isLastPage:((page-1)*10+posts.length)==total,
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
      });
    });   
  });
});




//文章页面路由
app.get('/topic/:name/:day/:title',function(req,res){
  Post.getOne(req.params.name,req.params.day,req.params.title,function(err,post){
    if(err){
      req.flash('error',err);
      return res.redirect('/');
    }

    res.render('topic/article',{
      title:req.params.title,
      post:post,
      user:req.session.user,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()
    });
  });
});


//添加文章评论

app.post('/topic/:name/:day/:title',function(req,res){

  var date=new Date(),
      time=date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
             date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  var comment={
    name:req.body.name,
    email:req.body.email,
    website:req.body.website,
    time:time,
    content:req.body.content
  };
  var newComment=new Comment(req.params.name,req.params.day,req.params.title,comment);
    newComment.save(function (err) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('back');
    }
    req.flash('success', '留言成功!');
    res.redirect('back');
  });

});






//编辑文章

app.get('/edit/:name/:day/:title', checkLogin);

app.get('/edit/:name/:day/:title',function(req,res){
  var currentUser=req.session.user;
  Post.edit(currentUser.name,req.params.day,req.params.title,function(err,post){
    if(err){
      req.flash('error',err);
     
    }

    res.render('topic/edit',{
      title:'编辑',
      post:post,
      user:req.session.user,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()
    });
  });
});

//更新文章

app.post('/edit/:name/:day/:title', checkLogin);

app.post('/edit/:name/:day/:title',function(req,res){

  var currentUser=req.session.user;
  Post.update(currentUser.name,req.params.day,req.params.title,req.body.post,function(err){
    var url=encodeURI('/topic/'+req.params.name+'/'+req.params.day+'/'+req.params.title);
    if(err){
      req.flash('error',err);
      return res.redirect(url);
    }
    req.flash('success','修改成功！');
    res.redirect(url);
  });
});



//删除文章

app.get('/remove/:name/:day/:title', checkLogin);

app.get('/remove/:name/:day/:title',function(req,res){

  var currentUser=req.session.user;
  Post.remove(currentUser.name,req.params.day,req.params.title,function(err){
    if(err){
      req.flash('error',err);
      return res.redirect('back');
    }
    req.flash('success','删除成功！');
    res.redirect('/');
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



//登录

app.post('/login', function (req, res) {
  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  //检查用户是否存在
  User.get(req.body.name, function (err, user) {
    if (!user) {
      req.flash('error', '用户不存在!'); 
      res.redirect('/');
    }
    //检查密码是否一致
    if (user.password != password) {
      req.flash('error', '密码错误!'); 
      res.redirect('/');
 
    }
    //用户名密码都匹配后，将用户信息存入 session
    req.session.user = user;
    req.flash('success', '登陆成功!');
    res.redirect('back');//登陆成功后跳转到当前页
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