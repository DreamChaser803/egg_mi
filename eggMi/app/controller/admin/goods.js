'use strict';


// 继承基础控制器base
const BaseController = require("./base.js");

const fs = require('fs');

const path = require('path');

const pump = require('mz-modules/pump');


class GoodsController extends BaseController {

  async index() {

    let page = this.ctx.request.query.page || 1;
    
    let PageSize = 5;

    let goodsCount = await this.ctx.model.Goods.find({}).count();//goods数量

    let goodsResult = await this.ctx.model.Goods.find({}).skip((page-1)*PageSize).limit(PageSize);//分页查询

    await this.ctx.render(
              "admin/goods/index", 
              { 
                list : goodsResult,
                page : page,
                totalPages : Math.ceil(goodsCount/PageSize) //向上取整
              });

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
    if (formFields.goods_color) {
      //不为空
      formFields.goods_color = formFields.goods_color.toString();

    }
    let goodsRes = new this.ctx.model.Goods(formFields);
    let result = await goodsRes.save();

    //增加图库信息
    let goods_image_list = formFields.goods_image_list;
    if (result._id && goods_image_list) {

      if (typeof (goods_image_list) == 'string') {
        //goods_image_list如果有多条数据 会转成数组 一条数据的话会是字符串 所以需要判断
        goods_image_list = new Array(goods_image_list);

      }
      for (let i = 0; i < goods_image_list.length; i++) {
        let goodsImageRes = new this.ctx.model.GoodsImage({
          goods_id: result._id,
          img_url: goods_image_list[i],
          add_time: b.getTime(),
        });

        await goodsImageRes.save();
      }

    }
    //增加商品类型数据

    if (result._id) {

      let attr_value_list = formFields.attr_value_list;
      let attr_id_list = formFields.attr_id_list;

      //解决只有一个属性的时候存在的bug
      if (typeof (attr_id_list) == 'string') {
        attr_id_list = new Array(attr_id_list);
        attr_value_list = new Array(attr_value_list);
      }
      if (attr_value_list) {//不为空判断
        for (let i = 0; i < attr_value_list.length; i++) {
          //查询goods_type_attribute
          if (attr_value_list[i]) {
            let goodsTypeAttributeResutl = await this.ctx.model.GoodsTypeAttribute.find({ "_id": attr_id_list[i] })

            let goodsAttrRes = new this.ctx.model.GoodsAttr({
              goods_id: result._id,
              class_cate_id: formFields.class_cate_id,
              attribute_id: attr_id_list[i],
              attribute_type: goodsTypeAttributeResutl[0].attr_type,
              attribute_title: goodsTypeAttributeResutl[0].title,
              attribute_value: attr_value_list[i],
              add_time: b.getTime(),
            });

            await goodsAttrRes.save();
          }
        }
      }

    }

    await this.success('/admin/goods', '增加商品数据成功');

  }

  // 动态显示goodAttribute ajax请求
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

    //获取商品信息
    let goodsResult = await this.ctx.model.Goods.find({ _id: this.ctx.request.query.id });

    // 获取当前商品的颜色
    if (goodsResult[0].goods_color) { //判断goods 是否有 colors
      //  5bbb68dcfe498e2346af9e4a,5bbb68effe498e2346af9e4b,5bc067d92e5f889dc864aa96
      var colorArrTemp = goodsResult[0].goods_color.split(',');//转成数组

      var goodsColorArr = [];

      colorArrTemp.forEach((value) => {

        goodsColorArr.push({ "_id": value })

      })

      var goodsColorReulst = await this.ctx.model.GoodsColor.find({

        $or: goodsColorArr  //获取goods 的 colors

      })
    } else {

      var goodsColorReulst = []

    }

    //获取商品属性信息
    let goodsAttsResult = await this.ctx.model.GoodsAttr.find({ goods_id: this.ctx.request.query.id });

    let goodsAttsStr = "";

    goodsAttsResult.forEach(async (value) => {
      if (value.attribute_type == 1) {

        goodsAttsStr += `<li><span> ${value.attribute_title}:  </span><input type="hidden" name="attr_id_list" value="${value.attribute_id}" />  <input type="text" name="attr_value_list" value="${value.attribute_value}" /></li>`

      } else if (value.attribute_type == 2) {

        goodsAttsStr += `<li><span> ${value.attribute_title}: 　</span> <input type="hidden" name="attr_id_list" value="${value.attribute_id}">  <textarea cols="50" rows="3" name="attr_value_list">${value.attribute_value}</textarea></li>`

      } else if (value.attribute_type == 3) {

        // 获取goods_type_attribute
        let oneGoodsTypeAttributeResult = await this.ctx.model.GoodsTypeAttribute.find({ _id: value.attribute_id });

        // console.log(oneGoodsTypeAttributeResult)

        let arr = oneGoodsTypeAttributeResult[0].attr_value.split(' ');//以空格隔开                 

        // console.log(arr)

        goodsAttsStr += `<li><span>${value.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${value.attribute_id}" />`;

        goodsAttsStr += `<select name="attr_value_list">`;

        for (var j = 0; j < arr.length; j++) {

          if (arr[j] == value.attribute_value) {
            goodsAttsStr += `<option value="${arr[j]}" selected >${arr[j]}</option>`;
          } else {
            goodsAttsStr += `<option value="${arr[j]}" >${arr[j]}</option>`;
          }
        }
        goodsAttsStr += `</select>`;

        goodsAttsStr += `</li>`;
      }
      // console.log(goodsAttsStr)

    })

    //获取商品相册信息
    let goodsImageResult = await this.ctx.model.GoodsImage.find({ goods_id: this.ctx.request.query.id }); //不能放在 goodsAttsResult前面 不然不显示goodsAttsResult部分数据
    // console.log(goodsAttsResult)

    await this.ctx.render("admin/goods/edit",
      {
        colorResult: colorResult,
        goodsType: goodsType,
        goodsCate: goodsCate,
        goodsImage: goodsImageResult,
        goodsResult: goodsResult[0],
        goodsAtts: goodsAttsStr,
        goodsColor: goodsColorReulst
      });

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

    let formFields = Object.assign(files, parts.field);

    console.log(formFields);

    let b = new Date()

    //编辑商品信息
    formFields.add_time = b.getTime();

    if (formFields.goods_color) {
      //不为空
      formFields.goods_color = formFields.goods_color.toString();

    }

    //编辑商品的id
    let goods_id = parts.field.id;

    // 编辑商品
    await this.ctx.model.Goods.updateOne(
      {
        _id: goods_id
      },
      formFields
    );

    //编辑图库信息
    let goods_image_list = formFields.goods_image_list;

    if (goods_id && goods_image_list) {

      if (typeof (goods_image_list) == 'string') {
        //goods_image_list如果有多条数据 会转成数组 一条数据的话会是字符串 所以需要判断
        goods_image_list = new Array(goods_image_list);

      }
      for (let i = 0; i < goods_image_list.length; i++) {
        let goodsImageRes = new this.ctx.model.GoodsImage({
          goods_id: goods_id,
          img_url: goods_image_list[i],
          add_time: b.getTime(),
        });

        await goodsImageRes.save();
      }

    }

    //修改商品类型数据    1、删除以前的类型数据     2、重新增加新的商品类型数据

    //1、删除以前的类型数据

    await this.ctx.model.GoodsAttr.deleteMany({ "goods_id": goods_id });

    let attr_value_list = formFields.attr_value_list;

    let attr_id_list = formFields.attr_id_list;
    //编辑商品类型数据
    if (goods_id && attr_id_list && attr_value_list) {

      // console.log(attr_value_list)

      //解决只有一个属性的时候存在的bug
      if (typeof (attr_id_list) == 'string') {
        attr_id_list = new Array(attr_id_list);
        attr_value_list = new Array(attr_value_list);
      }
      for (let i = 0; i < attr_value_list.length; i++) {
        //查询goods_type_attribute
        if (attr_value_list[i]) {

          let goodsTypeAttributeResutl = await this.ctx.model.GoodsTypeAttribute.findOne({ "_id": attr_id_list[i] });
          // console.log(goodsTypeAttributeResutl)

          let goodsAttrRes = new this.ctx.model.GoodsAttr({
            goods_id: goods_id,
            cate_id: formFields.cate_id,
            attribute_id: attr_id_list[i],
            attribute_type: goodsTypeAttributeResutl.attr_type,
            attribute_title: goodsTypeAttributeResutl.title,
            attribute_value: attr_value_list[i],
            add_time: b.getTime(),
          });

          await goodsAttrRes.save();
        }
      }
      attr_value_list.forEach(async () => {

      })
    }

    await this.success('/admin/goods', '编辑商品数据成功');

  }

  //编辑图片颜色
  async changeGoodsImageColor() {

    var color_id = this.ctx.request.body.color_id;

    var goods_image_id = this.ctx.request.body.goods_image_id;
    console.log(this.ctx.request.body);
    if (color_id) {
      color_id = this.app.mongoose.Types.ObjectId(color_id);
    }

    var result = await this.ctx.model.GoodsImage.updateOne({ "_id": goods_image_id }, {
      color_id: color_id
    })
    if (result) {

      this.ctx.body = { 'success': true, 'message': '更新数据成功' };
    } else {

      this.ctx.body = { 'success': false, 'message': '更新数据失败' };
    }

  }

  //删除图片
  async goodsImageRemove() {

    let goods_image_id = this.ctx.request.body.goods_image_id;

    //注意  图片要不要删掉   fs模块删除以前当前数据对应的图片

    let deleteResult = await this.ctx.model.GoodsImage.findOne({ "_id": goods_image_id });            //注意写法

    // console.log(deleteResult.img_url)
    //数据库图片物理删除  注意加上app 不然找不到图片
    fs.unlink("app" + deleteResult.img_url, (err) => {
      if (err) {
        console.log(err);
      }
      // console.log('删除文件成功');
    })
    fs.unlink("app" + deleteResult.img_url + "_200x200" + path.extname(deleteResult.img_url), (err) => {
      if (err) {
        console.log(err);
      }
      // console.log('删除文件成功');
    })
    let result = await this.ctx.model.GoodsImage.deleteOne({ "_id": goods_image_id });            //数据库图片删除地址

    if (result) {

      this.ctx.body = { 'success': true, 'message': '删除数据成功' };
    } else {

      this.ctx.body = { 'success': false, 'message': '删除数据失败' };
    }

  }

  //商品删除
  async goodsDelete() {

    let goods_id = this.ctx.request.query.id;

    //  删除goods
    await this.ctx.model.Goods.deleteOne({_id : goods_id});

    // //  删除goods_attr
    await this.ctx.model.GoodsAttr.deleteMany({goods_id : goods_id});

    let deleteResult = await this.ctx.model.GoodsImage.findOne({ goods_id: goods_id });            //注意写法
    console.log(deleteResult)

    if (deleteResult) {

      for (let i = 0; i < deleteResult.length; i++) {
        
        //数据库图片物理删除  注意加上app 不然找不到图片
        fs.unlink("app" + deleteResult[i].img_url, (err) => {
          if (err) {
            console.log(err);
          }
          // console.log('删除文件成功');
        })
        fs.unlink("app" + deleteResult[i].img_url + "_200x200" + path.extname(deleteResult[i].img_url), (err) => {
          if (err) {
            console.log(err);
          }
          // console.log('删除文件成功');
        })
      }

    }
    // //  删除goods
    await this.ctx.model.GoodsImage.deleteMany({goods_id : goods_id});

    await this.success("/admin/goods","删除商品成功")
  }

}

module.exports = GoodsController;
