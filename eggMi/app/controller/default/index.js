'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {


  /*
  不可拓展属性的对象    http://bbs.itying.com/topic/5bea72c10e525017c44947cf
*/


  //首页
  async index() {

    // console.time("index")

    //获取首页轮播图
    let focus = await this.ctx.service.cache.get("index_focus");
    if (!focus) {
      focus = await this.ctx.model.Upload.find({});
      await this.ctx.service.cache.set("index_focus", focus, 60 * 60);
    }

    // 手机
    let shoujiResult = await this.ctx.service.cache.get("index_shoujiResult");
    if (!shoujiResult) {
      shoujiResult = await this.ctx.service.goods.get_category_recommend_goods("5bbf058f9079450a903cb77b", "new", 8);
      await this.ctx.service.cache.set("index_shoujiResult", shoujiResult, 60 * 60);
    }

    // 电视
    let dianshiResult = await this.ctx.service.goods.get_category_recommend_goods("5bbf05ac9079450a903cb77c", "new", 8);

    // 耳机
    let erjiResult = await this.ctx.service.goods.get_category_recommend_goods("5be8fe279567312f28240be7", "new", 8);


    // console.timeEnd("index")
    await this.ctx.render('default/index', {
      focus: focus,
      shoujiResult: shoujiResult
    });
  }
}

module.exports = IndexController;
