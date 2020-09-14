'use strict';

const { options } = require('svg-captcha');

const Controller = require('egg').Controller;

const Alipay = require('alipay-mobile').default

class AlipayController extends Controller {
    async pay() {

        // this.ctx.body='支付宝支付';


        var d=new Date();
        const data = {
            subject: '辣条111',             
            out_trade_no: d.getTime().toString(),
            total_amount: '0.1'     
        }

        var url=await this.service.alipay.doPay(data);

        this.ctx.redirect(url); 
        this.ctx.body='支付成功';

        
        // //接收异步通知     
        // var options = {
        //     app_id: '2018122062672017',
        //     appPrivKeyFile: "MIIEowIBAAKCAQEAytRAWUJE+t7Xg62PFPpwCxaIBwO942bZX2ehlHbdLSs0i1H3xHlIGTF/0pAYksLuXq8ovyGW263MqvAjt5n97JPjD1ip9eFuIZhZ2wbrOac+MerE+x7agDOBgmJGwdffxbGRRkjz/OtwrIfIVf7TcAm/MPSAuD3RAIkvVXzQO16x6BnBnev1JR+HybeyUssMCk1y6JZ2pZ4H62gGKGvDQcV8NW0q7g4qu2CwQKMVhbnMpG/wRuIla/MOB9MPZiV4CINsxNGya5mmzkXTemjheRl9me6dEZEgKU+tcgTH5Y36faRphbQQ9ATAt3EZQXw4gkoO9vHyEsf7mAAOofQyVQIDAQABAoIBAG+PpUEzKRvPnDyqJuwD/8KphvJMxZIhjOhj6MTvSCJDBGipEh24E8b/qe3YIhv/KftcXo4aXI7CHrPa19px0e/hO9/CBeHfN6M02B+Xw6P3cEcmeWgihU5EhjR/96lBIqzrSRuensz7dwL+wFtEiWmzgrzbjz1HiwC/dBCSUTqFlT7+M+xx8N6w3gQbZ8bpW33XY4KB26C5G8/g6ImEMUbNez8p+24qVztszHWfDHmGJp//Z4g6dgyd2RNrNZdzCyNmlsFRYRXgKa1WbC7qi2ihPUMmYLhlD5OFwZkGbk7bPy+GTYfAK6JjHRjONtdcE06pVFPUMlr7OL96MsABt1UCgYEA8YEPuvbE0Y4i+YlHrYxJ8iJ8WceWL1mNp6QFG6cNQ06+ohPhVVjEdKSFLQIz03aRGQI+E6Kuki5JVwlUeUmqJM1LJxA7NEm9b+YNQG+Y/23FcYAbuaiJp22qpo45XNLSs6QoKcqyJkZwM/Niv07mLP907PSt6WzM4a10vVs+pu8CgYEA1wDpWdxPpUsVfggCrfel6DveLzHvtX4DWPbL9NXj2j39B6Y0+1BuHMw5WZ/GoZxC0Gi/buuspwaqws9HiGg5ttMJqz23YOKUwHkpZrIpZjyVAjDoRduKcaX3q4/NCs5CPzWoGjfcJXoxcoZuYos5/kg+tXhmsH/DA0jmTfyR2vsCgYATZ71t1npGJFenGWLLDSS78g1v4Vut/lIlkEZgzHGCYQdsWpCWnQVcIgQZc73aVgKesdFvHnlMga+e8L765/Jl9qD9SI6ZSvuPzDpwXQc8LwPYdOTFbEdzTpqRu4fcb4xCpwQbJ5BdBvfpFLtwh9Ry9SveBmMbCIUF9TwWIwjLvQKBgFcQpG5iO9J4zFREFCm0rneTvs6nzyVUyTA+iKs17lYTYiK12KComl6JCPRVMk+BgsD4mgTl5P2iQoYvAA2p/y0c2r6AeIEAYDJtHinbHc6r27+OZJDdbXvGNLxBuEuW6NbF+LPdSQXYLKvu6kZ3kN17DgHYpuT0Z9ktrS2JiNr/AoGBAMBMG/25ioZMVuMFL2D1NqW221NLGMnHtFSATT1o6XGNEd5/PABCei7l2KSSrv93wyXllnk6cVauSn32zmKNWC0i6Ei89wYIUlgF7grRxBWHm0H8hgbss4YHqEf19t8Fu9QW0g48VXWsZaDmoNQotxytWx3rJ5jIuvz8xWz+UkbH",
        //     alipayPubKeyFile: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhb/KlxYfhRE8KRp92MQM8ZB8NVjoM9LYFOnPIuNtcMZVA8ld7ybDP2FiA+QEE7wLGqMImwl1Y4xzkrTLCjHVC8fdR8ZvzZR2I3ZOrARerI9+RbkCfT+7YLv55+A+WTHEyiB+v7PfXVTT28s0CHNLPXMyQD1u8UVEQEpbMSs8hH3pJF55Li7kc5VvJpV3RVO9TXZTVAA5mSp9FvO3u+47IJDgFVLnqqHh6ETL1nHVpxiAY2LGer+RWpVYD8v+We+VWsrfJP7bO0xr2pwizldepo8YNYPgcIAIwd7KiveypL1pA0xWgSjUHzrkVh1j/nSnvJgKSdydU/VRcaVt/Mt8wwIDAQAB"
        //   }

        // var service = new Alipay(options)
        // var data = {      
        //     subject: '辣条',
        //     out_trade_no: '1232423',
        //     total_amount: '0.1'
        // }
    
        // var basicParams = {
        //     return_url: 'http://127.0.0.1:7001/alipay/alipayReturn', //支付成功返回地址
        //     notify_url: 'http://127.0.0.1:7001/alipay/alipayNotify' //支付成功异步通知地址
        //   }
        // var result = await service.createPageOrderURL(data, basicParams);
        // this.ctx.redirect(result.data); 
        // console.log(result)
        // assert(result.code == 0, result.message)
    }

    //支付成功以后更新订单   必须正式上线
    async alipayNotify() {

        const params = this.ctx.request.body; //接收 post 提交的 XML 

        console.log(params);

        var result = await this.service.alipay.alipayNotify(params);

        console.log('-------------');

        console.log(result);


        if (result.code == 0) {
            if (params.trade_status == 'TRADE_SUCCESS') {
                //更新订单
            }
        }

        //接收异步通知
    }
   
    async alipayReturn(){


        this.ctx.body='支付成功';

        //接收异步通知        
    }
}

module.exports = AlipayController;
