require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PricingSchema = new Schema({
   name:{
       type:String,
       required:[true,'Please input package name']
   },
   description:{
       type:String
   },
   thumbnail:{
       type:String,
       required:[true,'Please input pricing thumbnail']      
   },
   is_shown:{
       type:Boolean,
       default:true
   }
});


module.exports = mongoose.model('pricing', PricingSchema);
