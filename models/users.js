var User=require('../lib/mongo').User;

module.exports={
	create:function create(user){
		return User.create(user).exec();
	},
	//注册用户

	getUserByName:function getUserByName(name){
		return User
		.findOne({name:name})
		.addCreateAt()
		.exec();
	}
	//通过用户名获取用户信息
};