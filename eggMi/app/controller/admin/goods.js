'use strict';


// 继承基础控制器base
const BaseController = require("./base.js");


class GoodsController extends BaseController {
    
  async index() {

     await this.ctx.render("admin/goods/index");

  }

  async add() {

    await this.ctx.render("admin/goods/add");
    
  }

  async doAdd() {
    
  }

  async edit() {
    
  }

  async doEdit() {
    
  }

}

module.exports = GoodsController;
