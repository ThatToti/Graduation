var express=require('express');
var router=express.Router();

var checkLogin=require('../middlewares/check').checkLogin;
//引入登录检测

router.get('/',checkLogin,function(req,res,next){
	req.session.user=null;
	req.flash('success','登出成功');
	res.redirect('/posts');
});
//清除用户信息，显示通知，跳回首页

model.exports=router;