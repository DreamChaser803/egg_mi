'use strict';

const Controller = require('egg').Controller;

class HelpController extends Controller {

  //帮助中心
  async index() {
    
    this.ctx.body='帮助中心';
  }
  
  // 帮助详情
  async info(){

    this.ctx.body='帮助详情';
  }
}

module.exports = HelpController;
