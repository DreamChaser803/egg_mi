'use strict';

const Controller = require('egg').Controller;

class ProductController extends Controller {

  async list() {

    //获取goodsCate 的 id
    let goodsCateCid = this.ctx.request.query.cid;

    let goodsCateRes = await this.ctx.model.GoodsCate.findOne({ "_id": goodsCateCid });

    // 判断是否是二级goodsCate
    if (goodsCateRes.pid == "0") {

      // 获取二级goodsCate 的 _id
      var goodsCateResult = await this.ctx.model.GoodsCate.find({ "pid": this.app.mongoose.Types.ObjectId(goodsCateCid) }, "_id");

      var goodsCate_list = [];

      goodsCateResult.forEach((value) => {

        goodsCate_list.push(
          {
            cate_id: value._id
          }
        )

      })

      var goodsRes = await this.ctx.model.Goods.find({ $or: goodsCate_list }, '_id title price sub_title goods_img shop_price');

    } else {

      var goodsRes = await this.ctx.model.Goods.find({ cate_id: goodsCateCid }, '_id title price sub_title goods_img shop_price');

    }

    var tpl = goodsCateRes.template ? goodsCateRes.template : 'default/product_list.html'; // 判断是否是自定义页面 例如 aaa.html

    await this.ctx.render(tpl, { goodsRes: goodsRes });
  }

  async info() {
    //8、获取更多参数  循环商品属性

    /*

      颜色:红色,白色,黄色 |  尺寸:41,42,43

        [ 
          
          { cate: '颜色', list: [ '红色', '白色', '黄色 ' ] },
          { cate: ' 尺寸', list: [ '41', '42', '43' ] } 
      
        ]

      算法：

        var goodsAttr='颜色红色,白色,黄色 | 尺寸a41,42,43';
      
        if(goodsAttr&& goodsAttr.indexOf(':')!=-1){    
            goodsAttr=goodsAttr.replace(/，/g,',');
            goodsAttr=goodsAttr.replace(/：/g,':');            
            goodsAttr= goodsAttr.split('|');
            for( var i=0;i<goodsAttr.length;i++){                
                if(goodsAttr[i].indexOf(':')!=-1){
                    goodsAttr[i]={
                        cate:goodsAttr[i].split(':')[0],
                        list:goodsAttr[i].split(':')[1].split(',')
                    };
                }else{
                    goodsAttr[i]={}
                }
            }

        }else{
          goodsAttr=[]
          
        }
        console.log(goodsAttr);

    */   

    let goodsId = this.ctx.request.query.id; // 获取 goods 的 id 

    // 获取 goods 详情
    let goodsRes = await this.ctx.model.Goods.findOne({ _id: goodsId });


    //关联商品版本
    let relationGoodsIds = await this.ctx.service.goods.strToArray(goodsRes.relation_goods)
    let goods_version = await this.ctx.model.Goods.find({ $or: relationGoodsIds }, "goods_version shop_price");// 获取 goods 版本


    //关联商品color
    let goodsColorIds = await this.ctx.service.goods.strToArray(goodsRes.goods_color)
    let goodsColor = await this.ctx.model.GoodsColor.find({ $or: goodsColorIds });// 获取 goods color

    //7、获取规格参数信息
    let goodsAttr = await this.ctx.model.GoodsAttr.find({ "goods_id": goodsId });

    // 轮播图片详情
    let goodsImageResult=await this.ctx.model.GoodsImage.find({"goods_id":goodsId}).limit(8);

    await this.ctx.render('default/product_info.html',
      { 
        goodsRes: goodsRes, 
        goods_version: goods_version, 
        goodsColor: goodsColor,
        goodsAttr : goodsAttr,
        goodsImageResult : goodsImageResult
      });

  }

  async getImagelist(){
      try {
        let goods_id = this.ctx.request.query.goods_id;
        let color_id = this.ctx.request.query.color_id;
  
        var goodsImages = await this.ctx.model.GoodsImage.find({"color_id" : this.app.mongoose.Types.ObjectId(color_id),"goods_id": goods_id}).limit(8);
        console.log(goodsImages);
        if(goodsImages.length == 0){
           var goodsImages = await this.ctx.model.GoodsImage.find({"goods_id" : goods_id}).limit(8);
        }
        this.ctx.body = {"success":true,"result":goodsImages};
      } catch (error) {
        console.log(error)
        this.ctx.body = {"success":false,"result": []};
      }
  }

}

module.exports = ProductController;
