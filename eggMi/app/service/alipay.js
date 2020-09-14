'use strict';

const Service = require('egg').Service;

const Alipay = require('alipay-mobile').default

class AlipayService extends Service {

  async doPay(orderData) {

    return new Promise( async (resolve,reject)=>{
     
          //实例化 alipay
          const service = new Alipay(this.config.alipayOptions);        
          
          //获取返回的参数
          // this.config.alipayBasicParams
         var result = await  service.createPageOrderURL(orderData, this.config.alipayBasicParams);
            console.log(result.data);
            resolve(result.data);
          // .then(result => {
          //   console.log(result);
          //   resolve(result.data);
           
          // })
    })

      
  }


  //验证异步通知的数据是否正确
  alipayNotify(params){

    //实例化 alipay
    const service = new Alipay(this.config.alipayOptions);        
          
    return service.makeNotifyResponse(params);


  }

}

module.exports = AlipayService;
