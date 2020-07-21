module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    var d=new Date();
   
    const AdminSchema = new Schema({
      username: { type: String  , trim : true},
      password: { type: String  , trim : true},
      mobile: { type: String  , trim : true},
      email: { type: String  , trim : true},
      status: { type: Number,default:1  },
      role_id: { type:Schema.Types.ObjectId }, //角色id
      add_time: {           
        type:Number,        
        default: d.getTime()
    
       },
       is_super: { type:Number,default : 0}  //是否是超级管理员 1代表是


    });

   
    return mongoose.model('Admin', AdminSchema,'admin');
}