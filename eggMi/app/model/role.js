module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  //这个表只初始一次,所以随机时间每次都是一样的需要在role.js控制器里面定义时间
  let d=new Date();
  // console.log("1111111111111");
  
  const RoleSchema = new Schema({
    title: { type: String  },
    description: { type: String  },   
    status: { type: Number,default: 1 },    
    add_time: {           
      type:Number,        
      default: d.getTime()    
     }

  });

 
  return mongoose.model('Role', RoleSchema,'role');
}