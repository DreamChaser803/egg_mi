'use strict';

// 继承基础控制器base
const BaseController = require("./base.js");

//导入内置模块
// const path = require("path")
const fs = require("fs")

const pump = require('mz-modules/pump');

class UploadController extends BaseController {

    async index() {

        let uploadResult = await this.ctx.model.Upload.find({});

        await this.ctx.render("admin/upload/index", { list: uploadResult })
    }

    async add() {
        await this.ctx.render("admin/upload/add")
    }

    async doAdd() {
        // autoFields
        let parts = this.ctx.multipart({ autoFields: true }); //获取数据流
        let files = {};
        let stream;

        while ((stream = await parts()) != null) {
            if (stream.filename == null) {
                return
            }
            let fieldname = stream.fieldname; //获取流数据key
            let dir = await this.ctx.service.tools.getUploadFile(stream.filename);  //使用公共方法 获取保存目录地址
            // console.log(dir)
            /*
            dir={
                uploadDir: 'app\\public\\admin\\upload\\20200730\\1596095953393.jpg',   保存服务器地址
                saveDir: '/public/admin/upload/20200730/1596095953393.jpg'    保存数据库地址
              }
            */
            // 创建写入流
            let writeStream = fs.createWriteStream(dir.uploadDir);

            await pump(stream, writeStream);

            files = Object.assign(files, {//对象合并方法 Object.assign()
                [fieldname]: dir.saveDir //保存到数据库的地址
            })

        }

        let focus = new this.ctx.model.Upload(Object.assign(files, parts.field)); //地址保存到数据库

        await focus.save();

        await this.success('/admin/upload', '增加轮播图成功');
    }

    async edit() {

        let id = this.ctx.request.query.id; // 获取轮播图id

        let editResult = await this.ctx.model.Upload.find({ _id: id })

        await this.ctx.render("/admin/upload/edit", { list: editResult[0] })
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

        }

        //修改操作

        var id = parts.field.id;


        var updateResult = Object.assign(files, parts.field);

        await this.ctx.model.Upload.updateOne({ "_id": id }, updateResult);

        await this.success('/admin/upload', '修改轮播图成功');
    }



















    // /*
    //    上传文件 图片
    // */
    // async index() {
    //     await this.ctx.render("/admin/upload/indexList")
    // }

    // //单文件上传
    // async doSingleUpload() {
    //     // 获取表单提交流数据
    //     const stream = await this.ctx.getFileStream(); //只能接受一个文件

    //     // console.log(stream)

    //     // 上传的目录路径    注意目录要存在            zzz/ewfrewrewt/dsgdsg.jpg    path.basename()        dsgdsg.jpg
    //     const target = "app/public/admin/upload/" + path.basename(stream.filename)

    //     // 创建写入流
    //     let writeStream = fs.createWriteStream(target)

    //     await pump(stream, writeStream);
    //     // stream.pipe(writeStream);   //可以用， 但是不建议

    //     // this.ctx.body = {
    //     //     url: target,
    //     //     fields: stream.fields  //表单的其他数据
    //     // }

    //     await this.success("/admin/upload", "文件上传成功")
    // }


    // async multi() {
    //     await this.ctx.render("/admin/upload/multi")
    // }

    // // //多文件上传
    // async doMultiUpload() {

    //     // 接收数据post传过来的数据  {autoFields : true}设置将上传文件外的数据放在 parts.filed中
    //     const parts = this.ctx.multipart({autoFields : true})

    //     let files = [];//储存返回数据
    //     let stream;

    //     //多文件上传 一个一个接收 while循环
    //     while((stream = await parts()) != null){

    //        let fieldname = stream.fieldname; //获取文件key;

    //        let target = "app/public/admin/upload/" + path.basename(stream.filename) //保存文件的地址

    //        let writeStream = fs.createWriteStream(target); // 创建写入流

    //        await pump(stream,writeStream) //写入writeStream 多文件上传需要使用这种方式   写入 并 销毁当前流

    //        files.push(
    //            {
    //             [fieldname] : target   //将路径保存到 流数据的key
    //            }
    //        )

    //     }

    //     this.ctx.body = {
    //         files : files,
    //         fileds : parts.field  //这个数据必须在while循环结束后获取
    //     }

    // }

}

module.exports = UploadController;
