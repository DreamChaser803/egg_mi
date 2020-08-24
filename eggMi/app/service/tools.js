'use strict';

const Service = require('egg').Service;

const md5 = require('md5');

const path = require("path");

const sd = require('silly-datetime');

const mkdirp = require('mz-modules/mkdirp');

const svgCaptcha = require('svg-captcha');

const Jimp = require("jimp"); //缩略图


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

  //上传文件路径
  async getUploadFile(filename) {

    // 1、获取当前日期     20180920

    let day = sd.format(new Date(), 'YYYYMMDD');

    //2、创建图片保存的路径

    let dir = path.join(this.config.uploadDir, day);

    await mkdirp(dir);

    let d = await this.getTime();   /*毫秒数*/


    //返回图片保存的路径

    let uploadDir = path.join(dir, d + path.extname(filename)); //文件后缀名


    // app\public\admin\upload\20180914\1536895331444.png
    return {
      uploadDir: uploadDir,
      saveDir: uploadDir.slice(3).replace(/\\/g, '/')
    }




  }

  //缩略图
  async JimpImg(target) {
    Jimp.read(target, (err, lenna) => {
      if (err) throw err;

      for (let i = 0; i < this.config.jimpSize.length; i++) {
        let w = this.config.jimpSize[i].width;
        let h = this.config.jimpSize[i].height;
        lenna.resize(w, h) // resize
          .quality(90) // set JPEG quality
          // .greyscale() // set greyscale
          .write(target + '_'+ w + 'x' + h + path.extname(target)); // save
      }
    });
  }
}

module.exports = ToolsService;
