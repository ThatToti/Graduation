var path=require('path');
var express=require('express');
var session=require('express-session');
var MongoStore=require('connect-mongo')(session);
var flash=require('connect-flash');
var config=require('config-lite');
var routes=require('./routes');
var pkg=require('./package');

var app=express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
//设置模板目录，模板引擎为ejs

app.use(express.static(path.join(__dirname,'public')));
//设置静态文件目录

app.use(session({
	name:config.session.key,
	secret:conig.session.secret,
	cookie:{
		maxAge:config.session.maxAge
	},
	store:new MongoStore({
		url:config.mongodb
	})
}));
//session中间件

app.use(flash());
//flash中间件

app.use(require('express-formidable'))({
	uploadDir:path.join(__dirname,'./public/img'),//原文档存在问题
	keepExtensions:true//保留后缀
});

// 设置模板全局常量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
};

// 添加模板必需的三个变量
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});

routes(app);
//路由

app.listen(config.port,function(){
	console.log(`${pkg.name} listening on port ${config.port}`);
});
//监听端口，静态的
