

module.exports = (options, app) => {

    //登入鉴权
    return async (ctx, next) => {

        ctx.state.csrf = ctx.csrf;   //全局变量

        //获取用户信息
        ctx.state.userinfo = ctx.service.cookies.get('userinfo');

        //获取导航的数据上
        let topNav = await ctx.service.cache.get("index_topNav");
        if (!topNav) {
            topNav = await ctx.model.Nav.find({ position: 1 });
            await ctx.service.cache.set("index_topNav", topNav, 60 * 60);
        }


        //商品分类
        let goodsCate = await ctx.service.cache.get("index_goodsCate");
        if (!goodsCate) {
            goodsCate = await ctx.model.GoodsCate.aggregate([
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
            await ctx.service.cache.set("index_goodsCate", goodsCate, 60 * 60);
        }

        //获取导航的数据中 
        let middleNav = await ctx.service.cache.get("index_middleNav");
        if (!middleNav) {
            middleNav = await ctx.model.Nav.find({ position: 2 });

            // 克隆
            middleNav = JSON.parse(JSON.stringify(middleNav));

            for (let i = 0; i < middleNav.length; i++) {
                if (middleNav[i].relation) {
                    try {

                        let tempArr = middleNav[i].relation.replace(/，/g, /,/).split(",") // 避免中文,符号转化英文

                        let tempRelationIds = [];
                        tempArr.forEach((value) => {
                            tempRelationIds.push({
                                "_id": app.mongoose.Types.ObjectId(value)
                            })
                        })

                        // 查询cate 关联的 商品数据
                        let relationGoods = await ctx.model.Goods.find({
                            $or: tempRelationIds
                        }, 'title goods_img');

                        middleNav[i].subGoods = relationGoods;

                    } catch (err) {

                        middleNav[i].subGoods = []

                    }

                } else {
                    middleNav[i].subGoods = []
                }
            }
            await ctx.service.cache.set("index_middleNav", middleNav, 60 * 60);
        }

        ctx.state.topNav = topNav;
        ctx.state.goodsCate = goodsCate;
        ctx.state.middleNav = middleNav;

        await next();
    }
}