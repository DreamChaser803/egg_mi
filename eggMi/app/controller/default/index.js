'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  //首页
  async index() {

    await this.ctx.render('default/index');
    
  }
}

module.exports = IndexController;
