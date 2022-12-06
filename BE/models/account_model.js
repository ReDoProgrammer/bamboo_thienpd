require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const accountSchema = new Schema({
    username:{
        type:String,
        required: [true, 'Please input title name']
    },
    password:{
        type:String,
        default:''
    },
    fullname:{
        type:String
    }   
});


module.exports = mongoose.model('account',accountSchema);
