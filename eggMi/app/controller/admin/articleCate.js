'use strict';

// 继承基础控制器base
const BaseController = require("./base.js");

const fs = require('fs');

const path = require('path');

const pump = require('mz-modules/pump');

class ArticleCateController extends BaseController {
    async index() {

        //查询权限数据列表
        let articleCate = await this.ctx.model.ArticleCate.aggregate([
            {
                $lookup: {
                    from: "article_cate",
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

        console.log(articleCate)

        await this.ctx.render("admin/articleCate/index", { list: articleCate })

    }

    async add() {

        let articleCate = await this.ctx.model.ArticleCate.find({
            pid: "0"
        })

        await this.ctx.render("admin/articleCate/add", { cateList: articleCate })

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

        let goodsCate = new this.ctx.model.ArticleCate(
            updateResult
        )
        await goodsCate.save();

        await this.success('/admin/articleCate', '增加文章分类成功');

    }

    async edit() {

        // console.log(this.ctx.request.query.id)
        let articleCate = await this.ctx.model.ArticleCate.find({
            pid: "0"
        })
        let list = await this.ctx.model.ArticleCate.findOne({
            _id: this.ctx.request.query.id
        })

        await this.ctx.render("admin/articleCate/edit", { cateList : articleCate, list })

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

        // console.log(parts.field)
        //增加操作
        if (parts.field.pid != 0) {

            parts.field.pid = this.app.mongoose.Types.ObjectId(parts.field.pid);    //调用mongoose里面的方法把字符串转换成ObjectId      

        }
        let updateResult = Object.assign(files, parts.field);

        let b = new Date()

        updateResult.add_time = b.getTime(); //添加的时间

        await this.ctx.model.ArticleCate.updateOne(
            {
                _id: parts.field.id
            },
            updateResult
        )

        await this.success('/admin/articleCate', '编辑文章分类成功');

    }
}

module.exports = ArticleCateController;
