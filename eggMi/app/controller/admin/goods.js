'use strict';


// 继承基础控制器base
const BaseController = require("./base.js");

const fs = require('fs');

const pump = require('mz-modules/pump');


class GoodsController extends BaseController {

  async index() {

    await this.ctx.render("admin/goods/index");

  }

  async add() {

    //获取所有颜色
    let colorResult = await this.ctx.model.GoodsColor.find();

    //获取所有的商品类型
    let goodsType = await this.ctx.model.GoodsType.find({});

    //获取商品分类

    let goodsCate = await this.ctx.model.GoodsCate.aggregate([

      {
        $lookup: {
          from: 'goods_cate',
          localField: '_id',
          foreignField: 'pid',
          as: 'items'
        }
      },
      {
        $match: {
          "pid": '0'
        }
      }

    ])

    await this.ctx.render("admin/goods/add", { colorResult: colorResult, goodsType: goodsType, goodsCate: goodsCate });

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

    }

    let formFields = Object.assign(files, parts.field);

    console.log(formFields);

    let b = new Date()

    //增加商品信息
    formFields.add_time = b.getTime();
    let goodsRes = new this.ctx.model.Goods(formFields);
    let result = await goodsRes.save();

    // console.log(result._id);
    //增加图库信息
    if (result._id) {
      let goods_image_list = formFields.goods_image_list;

      for (let i = 0; i < goods_image_list.length; i++) {
        let goodsImageRes = new this.ctx.model.GoodsImage({
          goods_id: result._id,
          img_url: goods_image_list[i],
          add_time : b.getTime(),
        });

        await goodsImageRes.save();
      }

    }
    //增加商品类型数据

    if (result._id) {

      let attr_value_list = formFields.attr_value_list;
      let attr_id_list = formFields.attr_id_list;

      for (let i = 0; i < attr_value_list.length; i++) {
        //查询goods_type_attribute
        if (attr_value_list[i]) {
          let goodsTypeAttributeResutl = await this.ctx.model.GoodsTypeAttribute.find({ "_id": attr_id_list[i] })

          let goodsAttrRes = new this.ctx.model.GoodsAttr({
            goods_id: result._id,
            class_cate_id : formFields.class_cate_id,
            attribute_id: attr_id_list[i],
            attribute_type: goodsTypeAttributeResutl[0].attr_type,
            attribute_title: goodsTypeAttributeResutl[0].title,
            attribute_value: attr_value_list[i],
            add_time : b.getTime(),
          });

          await goodsAttrRes.save();
        }
      }

    }

    await this.success('/admin/goods', '增加商品数据成功');

  }

  async goodsTypeAttribute() {

    let cate_id = this.ctx.request.query.cate_id;

    // console.log(cate_id);
    //注意 await
    let goodsTypeAttribute = await this.ctx.model.GoodsTypeAttribute.find({ "cate_id": cate_id })

    // console.log(goodsTypeAttribute);

    this.ctx.body = {
      result: goodsTypeAttribute
    }
  }

  //实现图片上传 富文本
  async goodsUploadImage() {

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

    console.log(files);

    //图片的地址转化成 {link: 'path/to/image.jpg'} 

    this.ctx.body = { link: files.file };


  }
  //上传相册的图片
  async goodsUploadPhoto() {
    //实现图片上传
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
      await this.ctx.service.tools.JimpImg(target)

    }


    //图片的地址转化成 {link: 'path/to/image.jpg'} 

    this.ctx.body = { link: files.file };


  }

  async edit() {

  }

  async doEdit() {

  }

}

module.exports = GoodsController;
