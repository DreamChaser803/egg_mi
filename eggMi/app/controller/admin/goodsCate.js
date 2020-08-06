


'use strict';

// 继承基础控制器base
const BaseController = require("./base.js");

const fs = require('fs');

const pump = require('mz-modules/pump');

class GoodsCateController extends BaseController {

    //     模块jimp


    // 官方文档：


    // 	https://github.com/oliver-moran/jimp


    // 	https://github.com/oliver-moran/jimp/tree/master/packages/jimp



    // 用法：

    // 	1、安装  cnpm install --save jimp


    // 	2、引入：var Jimp = require("jimp");


    //     3、使用


    //     var Jimp = require('jimp');




    // 	// open a file called "lenna.png"
    // 	Jimp.read('lenna.png', (err, lenna) => {
    //  		 if (err) throw err;  		
    //     		 lenna.resize(256, 256) // resize
    //    			 .quality(60) // set JPEG quality
    //    			 .greyscale() // set greyscale
    //     			.write('lena-small-bw.jpg'); // save
    // 	});


    async index() {

        //查询权限数据列表
        let goodsCate = await this.ctx.model.GoodsCate.aggregate([
            {
                $lookup: {
                    from: "goods_cate",
                    localField: "_id",
                    foreignField: "pid",
                    as: "items"
                }
            },
            {
                $match: {
                    pid: "0"
                }
            }
        ])

        await this.ctx.render("admin/goodsCate/index", { list: goodsCate })

    }

    async add() {

        let goodsCates = await this.ctx.model.GoodsCate.find({
            pid: "0"
        })

        await this.ctx.render("admin/goodsCate/add", { goodsCates: goodsCates })

    }

    async doAdd() {

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

            await this.ctx.service.tools.JimpImg(target); //调用缩略图功能

        }

        console.log(parts.field)
        //增加操作
        if (parts.field.pid != 0) {

            parts.field.pid = this.app.mongoose.Types.ObjectId(parts.field.pid);    //调用mongoose里面的方法把字符串转换成ObjectId      

        }

        let updateResult = Object.assign(files, parts.field);

        let b = new Date()

        updateResult.add_time = b.getTime(); //添加的时间

        let goodsCate = new this.ctx.model.GoodsCate(
            updateResult
        )
        await goodsCate.save();

        await this.success('/admin/goodsCate', '增加商品分类成功');

    }

    async edit() {

        // console.log(this.ctx.request.query.id)
        let goodsCates = await this.ctx.model.GoodsCate.find({
            pid: "0"
        })
        let list = await this.ctx.model.GoodsCate.findOne({
            _id: this.ctx.request.query.id
        })

        await this.ctx.render("admin/goodsCate/edit", { goodsCates: goodsCates, list })

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
            this.service.tools.jimpImg(target);
        }

        console.log(parts.field)
        //增加操作
        if (parts.field.pid != 0) {

            parts.field.pid = this.app.mongoose.Types.ObjectId(parts.field.pid);    //调用mongoose里面的方法把字符串转换成ObjectId      

        }
        let updateResult = Object.assign(files, parts.field);

        let b = new Date()

        updateResult.add_time = b.getTime(); //添加的时间

        await this.ctx.model.GoodsCate.updateOne(
            {
                _id: parts.field.id
            },
            updateResult
        )

        await this.success('/admin/goodsCate', '编辑商品分类成功');

    }

}

module.exports = GoodsCateController;
