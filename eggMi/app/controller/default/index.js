'use strict';

const goods = require('../../model/goods');

const Controller = require('egg').Controller;

class IndexController extends Controller {
  //首页
  async index() {

    //获取导航的数据
    let topNav = await this.ctx.model.Nav.find({ position: 1 });

    //获取首页轮播图
    let focus = await this.ctx.model.Upload.find({});

    //商品分类
    let goodsCate = await this.ctx.model.GoodsCate.aggregate([

      {
        $lookup: {
          from: 'goods_cate',
          localField: '_id',
          foreignField: 'pid',
          as: 'items'
        }
      },
      {
        $match: {
          "pid": '0'
        }
      }

    ])

    //获取中间导航的数据

    /*
      不可拓展属性的对象    http://bbs.itying.com/topic/5bea72c10e525017c44947cf
    */

    //获取导航的数据中
    let middleNav = await this.ctx.model.Nav.find({ position: 2 });

    // 克隆
    middleNav = JSON.parse(JSON.stringify(middleNav));

    // console.log(middleNav);

    for (let i = 0; i < middleNav.length; i++) {
      if (middleNav[i].relation) {
        try {

          let tempArr = middleNav[i].relation.replace(/，/g, /,/).split(",") // 避免中文,符号转化英文
          // console.log(tempArr)
          let tempRelationIds = [];
          tempArr.forEach((value) => {
            tempRelationIds.push({
              "_id": this.app.mongoose.Types.ObjectId(value)
            })
          })
          // console.log(tempRelationIds)
          // 查询cate 关联的 商品数据
          let relationGoods=await this.ctx.model.Goods.find({
            $or:tempRelationIds
          },'title goods_img');
          // console.log(relationGoods)

          middleNav[i].subGoods=relationGoods;

        } catch (err) {

          middleNav[i].subGoods = []

        }

      } else {
        middleNav[i].subGoods = []
      }
    }
    //  console.log(middleNav)


    // 手机
    let shoujiResult = await this.ctx.service.goods.get_category_recommend_goods("5bbf058f9079450a903cb77b","new",8);

    // 电视
    let dianshiResult = await this.ctx.service.goods.get_category_recommend_goods("5bbf05ac9079450a903cb77c","new",8);

    // 耳机
    let erjiResult = await this.ctx.service.goods.get_category_recommend_goods("5be8fe279567312f28240be7","new",8);

    // console.log(shoujiResult)
    
    await this.ctx.render('default/index', {
      topNav: topNav,
      focus: focus,
      goodsCate: goodsCate,
      middleNav : middleNav,
      goodsRes : shoujiResult
    });
  }
}

module.exports = IndexController;
