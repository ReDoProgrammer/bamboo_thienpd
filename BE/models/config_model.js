require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const configSchema = new Schema({
    key:{
        type:String,
        required:true,
        unique:true   
    }, 
    description:{
        type:String
    },
    value:{
        type:String
    },
    active:{
        type:Boolean,
        default:true
    }        
});
module.exports = mongoose.model('config',configSchema);
