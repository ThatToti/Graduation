var express=require('express');
var router=express.Router();
var fs=require('fs');
var sha1=require('sah1');
var path=require('path');

var userModel=require('../models/users');
var checkNotLogin=require('../middlewares/check');
//一堆引入

router.get('/',checkNotLogin,function(req,res,next){
	res.render(signup);
});
//get注册页

router.post('/',checkNotLogin,function(req,res,next){
	var name=req.fields.name;
	var gender=req.fields.gender;
	var bio=req.fields.bio;
	var avatar=req.files.avatar.path.split(path.sep).pop();
	var password=req.fields.password;
	var repassword=req.fields.repassword;
	//获取表单的信息

	try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在 1-10 个字符');
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('性别只能是 m、f 或 x');
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介请限制在 1-30 个字符');
    }
    if (!req.files.avatar.name) {
      throw new Error('缺少头像');
    }
    if (password.length < 6) {
      throw new Error('密码至少 6 个字符');
    }
    if (password !== repassword) {
      throw new Error('两次输入密码不一致');
    }
    } catch (e) {
    // 注册失败，异步删除上传的头像
      fs.unlink(req.files.avatar.path);
      req.flash('error', e.message);
      return res.redirect('/signup');
    }
    //校验参数

    password=sha1(password);
    //密码加密

    var user={
    	name:name,
    	password:password,
    	gender:gender,
    	bio:bio,
    	avatar:avatar
    };
    //写入用户信息

    UserModel.create(user)
    .then(function(result){
    	user=result.ops[0];
    	delete user.password;
    	req.session.user=user;//用户信息插入session
    	req.flash('success','注册成功');
    	res.redirect('/posts');
    })
    .catch(function(e){
    	fs.unlink(req.files.avatar.path);注册失败，异步删除上传的头像
    	if (e.message.match('E11000 duplicate key')) {
        req.flash('error', '用户名已被占用');
        return res.redirect('/signup');
        }
        next(e);
    });
});

model.exports=router;