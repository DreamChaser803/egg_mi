'use strict';

const Controller = require('egg').Controller;

class SessionController extends Controller {
  async login() {

    var username=this.ctx.request.query.username;
    var age=this.ctx.request.query.age;

    console.log(username)
    console.log(age)
    this.ctx.session.userinfo={
        username:username,
        age:age
    };
    this.ctx.body={
        success:true,
        message:"用户登录成功"
    }
  }

  async user(){
    var userinfo=this.ctx.session.userinfo;
    console.log(userinfo);
    if(userinfo){
      this.ctx.body=userinfo;
    }else{

        this.ctx.body={
            success:false,
            message:"此用户不存在"
        }
    }
  }
}

module.exports = SessionController;
