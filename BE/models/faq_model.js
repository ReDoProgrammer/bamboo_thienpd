require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const faqSchema = new Schema({
    question:{
        type:String,
        require:[true,'Please input your question']
    },
    answer: {
        type: String,
        require:[true,'The answer can not be blank!']        
    } 
});


module.exports = mongoose.model('faq', faqSchema);
