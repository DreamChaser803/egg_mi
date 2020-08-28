let sd = require('silly-datetime');

let path = require("path")

let showdown = require("showdown")

module.exports = {

    //修改时间为年月日
    getDate(param){
       
        return sd.format(new Date(param), 'YYYY-MM-DD-HH:mm');
    },
    
    // 读取服务器显示不同的尺寸缩略图地址
    formatImg(dir,width,height){

        height=height||width;        
        return dir+'_'+width+'x'+height+path.extname(dir);
    },

    formatAttr(str){
        let converter = new showdown.Converter();       
        return converter.makeHtml(str);
    }
    
}