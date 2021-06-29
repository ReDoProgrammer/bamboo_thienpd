require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const sliderSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please input slder title']
    },
    img_link:{
        type:String,
        required: [true, 'Image can not be blank']
    },
    order:{
        type:Number,
        default:1
    }
});


module.exports = mongoose.model('slider', sliderSchema);
