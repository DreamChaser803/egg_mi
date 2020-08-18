'use strict';

// 继承基础控制器base
const BaseController = require("./base.js");

const fs = require('fs');

const path = require('path');

const pump = require('mz-modules/pump');

class ArticleController extends BaseController {

  async index() {

    let page = this.ctx.request.query.page || 1;

    let PageSize = 5;

    let goodsCount = await this.ctx.model.Article.find({}).count();//goods数量

    //查询权限数据列表
    let article = await this.ctx.model.Article.aggregate([
      {
        $lookup: {
          from: "article_cate",
          localField: "cate_id",
          foreignField: "_id",
          as: "catelist"
        }
      },
      // {
      //   $match: {
      //     pid: "0"
      //   }
      // }
      {
        $skip: (page - 1) * PageSize
      },
      {
        $limit: PageSize
      }
    ])
    // console.log(article)

    await this.ctx.render("admin/article/index",
      {
        list: article,
        page: page,
        totalPages: Math.ceil(goodsCount / PageSize), // 向上取整})
      }
    )
  }

  async add() {

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

    await this.ctx.render("admin/article/add", { cateList: articleCate })

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

    // console.log(parts.field);

    let updateResult = Object.assign(files, parts.field);

    let b = new Date()

    updateResult.add_time = b.getTime(); //添加的时间

    let goodsCate = new this.ctx.model.Article(
      updateResult
    )
    await goodsCate.save();

    await this.success('/admin/article', '增加文章成功');

  }

  async edit() {

    
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
    
    let article_list = await this.ctx.model.Article.find({_id : this.ctx.request.query.id})

    // console.log(article_list)

    await this.ctx.render("admin/article/edit",{ cateList: articleCate, list : article_list });

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

    await this.ctx.model.Article.updateOne(
        {
            _id: parts.field.id
        },
        updateResult
    )

    await this.success('/admin/article', '编辑文章成功');

}

}

module.exports = ArticleController;
