require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const servicePackSchema = new Schema({
   name:{
       type:String,
       required:[true,'Please input package name']
   },
   description:{
       type:String
   },
   price:{
       type:Number,
       default:0
   }
});


module.exports = mongoose.model('service_pack', servicePackSchema);
