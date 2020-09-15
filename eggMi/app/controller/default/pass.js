'use strict';

const Controller = require('egg').Controller;

class PassController extends Controller {

  //登录
  async login() {
    var returnUrl = this.ctx.request.query.returnUrl;
    returnUrl=returnUrl?decodeURIComponent(returnUrl):'/';
    await this.ctx.render('default/pass/login.html',{returnUrl : returnUrl});
  }

  // 登入功能
  async doLogin() {
    var username = this.ctx.request.body.username;
    var password = this.ctx.request.body.password;
    var identify_code = this.ctx.request.body.identify_code;
  //  console.log(username)
  //  console.log(password)
  //  console.log(identify_code)
    // 判断验证码是否正确
    if (identify_code.toUpperCase() != this.ctx.session.identify_code.toUpperCase()) { //错误
      // 为了安全 重新发送验证码
      var captcha = await this.ctx.service.tools.index(120, 50);  //服务里面的方法
      this.ctx.session.identify_code = captcha.text;   /*验证码的信息*/

      this.ctx.body = {
        success: false,
        msg: '输入的图形验证码不正确'
      }
    } else { // 正确

      password = await this.ctx.service.tools.md5(password);
      var userResult = await this.ctx.model.User.find({ "phone": username, password: password }, '_id phone last_ip add_time email status');//查询用户信息
      // 是否存在这个用户
      if (userResult.length != 0) {
        //cookies 安全      加密
        this.service.cookies.set('userinfo', userResult[0]);
        this.ctx.body = {
          success: true,
          msg: '登录成功'
        }
      } else {
        //重新生成验证码
        var captcha = await this.service.tools.captcha(120, 50);
        this.ctx.session.identify_code = captcha.text;

        this.ctx.body = {
          success: false,
          msg: '用户名或者密码错误'
        }
      }

    }
  }

  //退出登录
  async loginOut() {
    
    this.ctx.service.cookies.set('userinfo','');
    
    this.ctx.redirect('/');

  }

  //注册第一步 输入手机号
  async registerStep1() {
    await this.ctx.render('default/pass/register_step1.html');
  }

  //注册第二步  验证码验证码是否正确
  async registerStep2() {
    //获取验证参数
    var sign = this.ctx.request.query.sign; //签名
    var identify_code = this.ctx.request.query.identify_code; //图形验证码
    var add_day = await this.ctx.service.tools.getDay() // 年月日
    var userTempResult = await this.ctx.model.UserTemp.find({ "sign": sign, add_day: add_day }); // 秘钥是否过期

    if (userTempResult.length == 0) {
      this.ctx.redirect('/register/registerStep1');
    } else {
      await this.ctx.render('default/pass/register_step2.html', {
        sign: sign,
        phone: userTempResult[0].phone,
        identify_code: identify_code
      });
    }

  }

  //注册第三步  输入密码
  async registerStep3() {
    //获取验证参数
    var sign = this.ctx.request.query.sign; //签名
    var phone_code = this.ctx.request.query.phone_code; //手机验证码
    var add_day = await this.ctx.service.tools.getDay() // 年月日
    var msg = this.ctx.request.query.msg || '';
    var userTempResult = await this.ctx.model.UserTemp.find({ "sign": sign, add_day: add_day }); // 秘钥是否过期

    if (userTempResult.length == 0) {
      this.ctx.redirect('/register/registerStep1');
    } else {
      await this.ctx.render('default/pass/register_step3.html', {
        sign: sign,
        phone_code: phone_code,
        msg: msg
      });
    }
  }

  //发送短信验证码
  async sendCode() {

    var phone = this.ctx.request.query.phone;
    var identify_code = this.ctx.request.query.identify_code;  //用户输入的图形验证码

    if (identify_code.toUpperCase() != this.ctx.session.identify_code.toUpperCase()) {

      this.ctx.body = {
        success: false,
        msg: '输入的图形验证码不正确'
      }
    } else {

      //判断手机格式是否合法
      var reg = /^[\d]{11}$/;
      if (!reg.test(phone)) {
        this.ctx.body = {
          success: false,
          msg: '手机号不合法'
        }
      } else {

        var add_day = await this.service.tools.getDay();         //年月日    
        var sign = await this.service.tools.md5(phone + add_day);  //签名
        var ip = this.ctx.request.ip.replace(/::ffff:/, '');     //获取客户端ip         
        var phone_code = await this.service.tools.getRandomNum();  //发送短信的随机码    
        console.log(phone_code)
        // 查询是否发送过验证码
        var UserTempResult = await this.ctx.model.UserTemp.find({ sign: sign, add_day: add_day });

        // 一个ip一天只能 发送20次
        var ipCount = await this.ctx.model.UserTemp.find({ ip: ip, add_day: add_day }).count(); // 数量

        if (UserTempResult.length > 0) {
          // 限制每天发送短信次数
          if (UserTempResult[0].send_count < 6 && ipCount < 10) {

            var send_count = UserTempResult[0].send_count + 1;
            await this.ctx.model.UserTemp.updateOne({ '_id': UserTempResult[0]._id }, { send_count: send_count });
            // 发送验证码
            // this.service.sendCode.send(phone,'随机验证码')   实际应用
            this.ctx.session.phone_code = phone_code;
            this.ctx.body = {
              success: true,
              msg: "短信发送成功",
              sign: sign
            }
          } else {
            this.ctx.body = { "success": false, msg: '当前手机号码发送次数达到上限，明天重试' };
          }
        } else {
          var userTemp = new this.ctx.model.UserTemp({
            phone,
            add_day,
            sign,
            ip,
            send_count: 1
          })
          userTemp.save();

          // 发送验证码
          // this.service.sendCode.send(phone,'随机验证码')   实际应用
          this.ctx.session.phone_code = phone_code;
          this.ctx.body = {
            success: true,
            msg: "短信发送成功",
            sign: sign
          }
        }


      }

    }



  }

  //验证手机验证码
  async validatePhoneCode() {

    var sign = this.ctx.request.query.sign;
    var phone_code = this.ctx.request.query.phone_code;
    var add_day = await this.ctx.service.tools.getDay() //获取当年年月日

    if (phone_code != this.ctx.session.phone_code) {
      this.ctx.body = {
        success: false,
        msg: "您输入的手机验证码错误"
      }
    } else {
      var userTempResult = await this.ctx.model.UserTemp.find({ "sign": sign, add_day: add_day }); // 验证签名是否过期
      if (userTempResult.length == 0) {
        this.ctx.body = {
          success: false,
          msg: '参数错误'
        }
      } else {
        // 判断验证码是否过期
        var nowTime = await this.ctx.service.tools.getTime();
        if ((userTempResult[0].add_time - nowTime) / 1000 / 60 > 30) {
          this.ctx.body = {
            success: false,
            msg: "验证码已过期"
          }
        } else {
          var userResult = await this.ctx.model.User.find({ phone: userTempResult[0].phone });//用户是否注册
          if (userResult.length > 0) {
            this.ctx.body = {
              success: false,
              msg: "用户已存在"
            }
          } else {
            this.ctx.body = {
              success: true,
              msg: "验证码输入正确",
              sign: sign
            }
          }
        }
      }

    }


  }
 
  //完成注册  post
  async doRegister() {
    var sign = this.ctx.request.body.sign;
    var phone_code = this.ctx.request.body.phone_code;
    var password = this.ctx.request.body.password;
    var rpassword = this.ctx.request.body.rpassword;
    var ip = this.ctx.request.ip.replace(/::ffff:/, "");
    var add_day = await this.ctx.service.tools.getDay(); // 年月日

    if (phone_code != this.ctx.session.phone_code) {
      // 非法操作
      this.ctx.redirect("/pass/registerStep1");
    } else {
      var userTempResult = await this.ctx.model.UserTemp.find({ sign: sign, add_day: add_day });
      if (userTempResult.length == 0) {
        // 非法操作
        this.ctx.redirect("/pass/registerStep1");
      } else {

        //传入参数正确 执行增加操作
        if (password.length < 6 && password != rpassword) {

          var msg = '密码不能小于6位并且密码和确认密码必须一致';
          this.ctx.redirect('/register/registerStep3?sign=' + sign + '&phone_code=' + phone_code + '&msg=' + msg);

        } else {

          var userModel = new this.ctx.model.User({
            phone: userTempResult[0].phone,
            password: await this.service.tools.md5(password),
            last_ip: ip
          })
          var userReuslt = await userModel.save();
          // 是否注册成功
          if (userReuslt) {
            //获取用户信息
            var userinfo = await this.ctx.model.User.find({ "phone": userTempResult[0].phone }, '_id phone last_ip add_time email status')

            //用户注册成功以后默认登录
            //cookies 安全      加密
            this.service.cookies.set('userinfo', userinfo[0]);
            this.ctx.redirect('/');
          }

        }
      }
    }

    // this.ctx.body = '完成注册';
  }

}

module.exports = PassController;
