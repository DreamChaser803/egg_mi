'use strict';

const Controller = require('egg').Controller;
class AddressController extends Controller {

  // 增加收货地址
  async addAddress() {

    /*
        1、获取表单提交的数据

        2、更新当前用户的所有收货地址的默认收货地址状态为0

        3、增加当前收货地址，让默认收货地址状态是1

        4、查询当前用户的所有收货地址返回


        */
    var name = this.ctx.request.body.name;
    var phone = this.ctx.request.body.phone;
    var address = this.ctx.request.body.address;
    var zipcode = this.ctx.request.body.zipcode;
    var uid = this.ctx.service.cookies.get("userinfo")._id;

    var addressResult = await this.ctx.model.Address.find({ "uid": uid }).count();
    
    if (addressResult > 10) {
      this.ctx.body = {
        success: false,
        result: '增加收货地址失败 收货地址数量超过限制',
      }
    } else {
      await this.ctx.model.Address.updateMany({ "uid": uid }, { default_address: 0 });
      var addressRes = new this.ctx.model.Address({
        uid,
        name,
        phone,
        address,
        zipcode
      })
      await addressRes.save();
      var addressResult = await this.ctx.model.Address.find({ "uid": uid }).sort({ default_address: -1 });
      this.ctx.body = {
        success: true,
        result: addressResult,
      };
    }


  }

  // 获取收货地址列表
  async getAddressList() {

    /*
            获取当前用户的所有收货地址
        */
    this.ctx.body = 'getAddressList';
  }

  // 获取一个收货地址

  async getOneAddressList() {
    /*
             返回指定收货地址id的收货地址
    */
    var uid = this.ctx.service.cookies.get("userinfo")._id;
    var id = this.ctx.request.query.id;

    var result = await this.ctx.model.Address.find({_id : id, uid : uid});

    if(result && result.length > 0){

    this.ctx.body = {
       success : true,
       msg : result
    }
        
    }
  }


  // 编辑收货地址
  async editOneAddressList() {

    /*
            1、获取表单增加的数据

            2、更新当前用户的所有收货地址的默认收货地址状态为0

            3、修改当前收货地址，让默认收货地址状态是1

            4、查询当前用户的所有收货地址并返回

        */
      var id = this.ctx.request.body.id;
      var name = this.ctx.request.body.name;
      var phone = this.ctx.request.body.phone;
      var address = this.ctx.request.body.address;
      var zipcode = this.ctx.request.body.zipcode;
      var uid = this.ctx.service.cookies.get("userinfo")._id;
  
        await this.ctx.model.Address.updateMany({ "uid": uid }, { default_address: 0 });
        await this.ctx.model.Address.updateOne({_id : id,"uid": uid },{
          uid,
          name,
          phone,
          address,
          zipcode,
          default_address : 1
        })
        var addressResult = await this.ctx.model.Address.find({ "uid": uid }).sort({ default_address: -1 });
        this.ctx.body = {
          success: true,
          result: addressResult,
        };
  }


  // 修改默认的收货地址
  async changeDefaultAddress() {

    /*

            1、获取用户当前收货地址id 以及用户id

            2、更新当前用户的所有收货地址的默认收货地址状态为0

            3、更新当前收货地址的默认收货地址状态为1

        */
    var uid = await this.ctx.service.cookies.get("userinfo")._id;
    var id = this.ctx.request.query.id;
    await this.ctx.model.Address.updateMany({ "uid": uid }, { default_address: 0 });
    await this.ctx.model.Address.update({ "_id": id, "uid": uid }, { default_address: 1 });
    this.ctx.body = {
      success: true,
      msg: " 默认选中完成"
    };

  }


}

module.exports = AddressController;
