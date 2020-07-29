'use strict';

// 继承基础控制器base
const BaseController = require("./base.js");

//导入内置模块
const path = require("path")
const fs = require("fs")

// const pump = require('mz-modules/pump');

class UploadController extends BaseController {
    /*
       上传文件 图片
    */
    async index() {
        await this.ctx.render("/admin/upload/index")
    }

    //单文件上传
    async doSingleUpload() {
        // 获取表单提交数据
        const stream = await this.ctx.getFileStream();

        // console.log(stream)

        // 上传的目录路径    注意目录要存在            zzz/ewfrewrewt/dsgdsg.jpg    path.basename()        dsgdsg.jpg
        const target = "app/public/admin/upload/" + path.basename(stream.filename)

        // 创建写入流
        let writeStream = fs.createWriteStream(target)

        // await pump(stream,writeStream);
        stream.pipe(writeStream);   //可以用， 但是不建议

        // this.ctx.body = {
        //     url: target,
        //     fields: stream.fields  //表单的其他数据
        // }

        await this.success("/admin/upload","文件上传成功")
    }

    async multi() {
        await this.ctx.render("/admin/upload/multi")
    }

    //多文件上传
    async doMultiUpload() {

    }
}

module.exports = UploadController;
