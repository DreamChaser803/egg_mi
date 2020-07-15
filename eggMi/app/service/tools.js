'use strict';

const Service = require('egg').Service;

const svgCaptcha = require('svg-captcha');

class ToolsService extends Service {
  

    //图形验证码功能封装
  async index() {
    //   验证码配置
    const captcha = svgCaptcha.create(
        {
            size: 6,
            fontSize: 50,
            width: 100,
            height: 40,
            background: "#cc9966"
        });

        this.ctx.session.code = captcha.text; /*验证码上面的信息*/

        return captcha;
  }
}

module.exports = ToolsService;
