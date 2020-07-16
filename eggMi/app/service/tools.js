'use strict';

const Service = require('egg').Service;

const md5 = require('md5');

const svgCaptcha = require('svg-captcha');

class ToolsService extends Service {


  //图形验证码功能封装
  async index() {
    //   验证码配置
    const captcha = svgCaptcha.create(
      {
        size: 4,
        fontSize: 50,
        width: 100,
        height: 40,
        // background: "#cc9966"
      });

    this.ctx.session.code = captcha.text; /*验证码上面的信息*/

    return captcha;
  }


  //md5 加密
  async md5(str) {

    return md5(str)

  }


  //时间错
  async getTime() {

    var d = new Date();

    return d.getTime();

  }
}

module.exports = ToolsService;
