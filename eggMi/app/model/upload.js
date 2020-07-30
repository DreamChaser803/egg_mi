module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    var d=new Date();
   
    const UploadSchema = new Schema({
      title: { type: String  },
      type: { type: Number  },   
      focus_img: { type: String  },   
      link: { type: String  },   
      sort: { type: Number  },   
      status: { type: Number,default:1  },    
      add_time: {           
        type:Number,        
        default: d.getTime()    
       }
    });
   
    return mongoose.model('Upload', UploadSchema,'upload');
}