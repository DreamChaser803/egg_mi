'use strict';
// 继承基础控制器base
const BaseController = require("./base.js");

class LoginController extends BaseController {
  
  //进入登入页面
  async index() {
    await this.ctx.render("/admin/login");
  }

  //登入功能
  async dologin() {

    //1, 获取用户参数信息
    let username = this.ctx.request.body.username;
    let password = await this.service.tools.md5(this.ctx.request.body.password);
    let code = this.ctx.request.body.code;

    //2,验证码是否正确       toUpperCase()大写
    if (code.toUpperCase() == this.ctx.session.code.toUpperCase()) {
      //查询是否有这个用户
      let result = await this.ctx.model.Admin.find(
        {
          "username": username, "password": password
        }
      );
      //3,判断是否有用户数据
      if (result.length > 0) {
        // 4,保存用户信息在服务器
        this.ctx.session.userInfo = result[0];
        // 5,提示登入成功 并跳转到对应页面
        await this.success("/admin", "登入成功");
      } else {
        await this.error("/admin/login", "用户名或密码错误");
      }
    } else {
      await this.error("/admin/login", "验证码错误")
    }
  }

  //退出登入
  async loginOut(){
     this.ctx.session.userInfo = null;
     await this.success("/admin/login","退出登入成功")
  }
}

module.exports = LoginController;
