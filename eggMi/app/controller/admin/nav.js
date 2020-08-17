'use strict';


// 继承基础控制器base
const BaseController = require("./base.js");
const nav = require("../../model/nav.js");

class NavController extends BaseController {

    async index() {
        let page = this.ctx.request.query.page || 1;

        let PageSize = 5;

        let goodsCount = await this.ctx.model.Nav.find({}).count();//goods数量

        let goodsResult = await this.ctx.model.Nav.find({}).skip((page - 1) * PageSize).limit(PageSize);//分Nav

        await this.ctx.render("/admin/nav/index",
            {
                list: goodsResult,
                page: page,
                totalPages: Math.ceil(goodsCount / PageSize) // 向上取整
            }
        );
    }

    async add() {

        await this.ctx.render("/admin/nav/add");

    }

    async doAdd() {

        let navList = this.ctx.request.body;

        let b = new Date();

        navList.add_time = b.getTime();

        let navRes = new this.ctx.model.Nav(navList);

        await navRes.save();

        await this.success("/admin/nav", "增加导航成功")

    }

    async edit() {
        let nav_id = this.ctx.request.query.id;

        let navResult = await this.ctx.model.Nav.findOne({ _id: nav_id });

        await this.ctx.render("/admin/nav/edit", { list: navResult });
    }

    async doEdit() {

        let navRes = this.ctx.request.body;

        let _id = this.ctx.request.body._id;

        let navResult = await this.ctx.model.Nav.update({ _id: _id }, navRes);

        if (navResult.ok) {
            await this.success("/admin/nav", "编辑导航成功");
        } else {
            await this.error("/admin/nav", "编辑导航失败");
        }
    }
}

module.exports = NavController;
