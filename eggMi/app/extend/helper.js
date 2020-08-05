let sd = require('silly-datetime');

module.exports = {

    //修改时间为年月日
    getDate(param){
       
        return sd.format(new Date(param), 'YYYY-MM-DD-HH:mm');
    },

    
}