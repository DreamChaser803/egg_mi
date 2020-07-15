'use strict';
// 继承基础控制器base
const BaseController = require("./base.js");

class LoginController extends BaseController {

  async index() {
    await this.ctx.render("/admin/login")
  }


  async dologin() {
     await this.error("/admin/login")
  }
}

module.exports = LoginController;
