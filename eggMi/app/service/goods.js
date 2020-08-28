'use strict';

const Service = require('egg').Service;

class GoodsService extends Service {

    /*
  根据商品分类获取推荐商品
   @param {String} cate_id - 分类id
   @param {String} type -  hot  best  new
   @param {Number} limit -  数量
*/


    async get_category_recommend_goods(cate_id, type, limit) {

        try {
            let goodsCateResult = await this.ctx.model.GoodsCate.find({ pid: this.app.mongoose.Types.ObjectId(cate_id) }, "_id");


            let goodsCate_list = [];
            goodsCateResult.forEach((value) => {
                goodsCate_list.push(
                    {
                        cate_id: this.app.mongoose.Types.ObjectId(value._id)
                    }
                )
            });

            //条件筛选 goods
            let findJson = {
                $or: goodsCate_list
            }
            // 关联
            switch (type) {
                case "hot":
                    findJson = Object.assign(findJson, { is_hot: 1 });
                    break;
                case "best":
                    findJson = Object.assign(findJson, { is_best: 1 });
                    break;
                case "new":
                    findJson = Object.assign(findJson, { is_new: 1 });
                    break;
                default:
                    findJson = Object.assign(findJson, { is_hot: 1 });
                    break;
            }

            let limitSize = limit || 10 //没传limit 就默认 10
            let goodsRes = await this.ctx.model.Goods.find(
                findJson,
                'title shop_price goods_img sub_title'
            ).limit(limitSize)

            return goodsRes
        } catch (error) {
            console.log(error);
            return []
        }
    }

    async strToArray(str) {
        try {

            let tempIds = [];

            if (str) {

                str = str.replace(/，/g, ",").split(",");

                str.forEach((value) => {
                    tempIds.push(
                        {
                            "_id": value
                        }
                    )
                })
            } else {
                return [{ "1": 1 }]
            }
            return tempIds

        } catch (error) {
            return [{ "1": 1 }]
        }
    }

}

module.exports = GoodsService;
