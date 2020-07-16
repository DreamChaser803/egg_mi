'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {

    /*
     
      基础控制器base，放置公用功能
    
    */

    // 成功提示
    async success(redirectUrl,message) {
        await this.ctx.render("admin/public/success", {
            redirectUrl,
            message : message || "操作成功!"
        })
    }
    //失败提示
    async error(redirectUrl,message) {
        await this.ctx.render("admin/public/error", {
            redirectUrl,
            message : message || "操作失败!"
        })
    }
    //图形验证码
    async verify() {

        let captcha = await this.service.tools.index() // 调用服务里面的方法

        this.ctx.response.type = 'image/svg+xml';// 指定返回指定的数据类型

        this.ctx.body = captcha.data;// 给页面返回一张图片
    }

}

module.exports = BaseController;
