'use strict';

const Controller = require('egg').Controller;

class FlowController extends Controller {
  // 购物车
  async cart() {

    await this.ctx.render('default/cart.html');
  }
}

module.exports = FlowController;
