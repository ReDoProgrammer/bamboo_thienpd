require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const messSchema = new Schema({
    name:{
        type:String,
        required:[true,'Please enter your name']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']                
    },
    message:{
        type:String,
        required:[true,'Please input message']
    } ,
    seen:{
        type:Boolean,
        default:false
    }
});


module.exports = mongoose.model('message', messSchema);
