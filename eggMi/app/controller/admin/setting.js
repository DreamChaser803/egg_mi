
'use strict';

// 继承基础控制器base
const BaseController = require("./base.js");

const fs = require('fs');

const path = require('path');

const pump = require('mz-modules/pump');

class SettingController extends BaseController {

    async index() {
       
       let settingRes = await this.ctx.model.Setting.find({});

        await this.ctx.render("admin/setting/index",{list : settingRes[0]})
    }

    async doEdit() {

        let parts = this.ctx.multipart({ autoFields: true });
        let files = {};
        let stream;
        while ((stream = await parts()) != null) {
            if (!stream.filename) {
                break;
            }
            let fieldname = stream.fieldname;  //file表单的名字

            //上传图片的目录
            let dir = await this.service.tools.getUploadFile(stream.filename);
            let target = dir.uploadDir;
            let writeStream = fs.createWriteStream(target);

            await pump(stream, writeStream);

            files = Object.assign(files, {
                [fieldname]: dir.saveDir
            })

            //生成缩略图
            await this.ctx.service.tools.JimpImg(target); //调用缩略图功能 
        }
        let updateResult = Object.assign(files, parts.field);

        let b = new Date()

        updateResult.add_time = b.getTime(); //添加的时间

        await this.ctx.model.Setting.updateOne(
            {},
            updateResult
        )
        console.log(updateResult)
        await this.success('/admin/setting', '修改系统设置成功');
    }
}

module.exports = SettingController;
