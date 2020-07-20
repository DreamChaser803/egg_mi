'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {

    /*
     
      基础控制器base，放置公用功能
    
    */

    // 成功提示
    async success(redirectUrl, message) {
        await this.ctx.render("admin/public/success", {
            redirectUrl,
            message: message || "操作成功!"
        })
    }
    //失败提示
    async error(redirectUrl, message) {
        await this.ctx.render("admin/public/error", {
            redirectUrl,
            message: message || "操作失败!"
        })
    }
    //图形验证码
    async verify() {

        let captcha = await this.service.tools.index() // 调用服务里面的方法

        this.ctx.response.type = 'image/svg+xml';// 指定返回指定的数据类型

        this.ctx.body = captcha.data;// 给页面返回一张图片
    }
    //公共删除功能
    async delete() {
        /*
        
          1, 获取要删除的数据库表; model
          2, 获取要删除的数据id;  _id
          3, 执行删除;
          4, 返回之前的页面; ctx.request.headers["referer"]  [上个页面地址]           
        */
        
        let model = this.ctx.request.query.model; //获取要删除数据的  数据表
        let id = this.ctx.request.query.id;//获取要删除的数据的  _id

        let SpecifyDeletion = await this.ctx.model[model].deleteOne(
            {
                _id: id
            }
        )
        if (SpecifyDeletion.ok) {
            // await this.success(this.ctx.request.headers["referer"], "删除成功") 第一种方式直接写在公共功能里面
            await this.success(this.ctx.state.prevPage, "删除成功") //第二种方式,封装到中间件里面 然后调用

        } else {
            // await this.error(this.ctx.request.headers["referer"], "删除失败")
            await this.error(this.ctx.state.prevPage, "删除失败")
        }

    }

}

module.exports = BaseController;
