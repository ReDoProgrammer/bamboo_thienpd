require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const postSchema = new Schema({
    caption: {
        type: String,
        required: [true, 'Please input title name']
    },
    description: {
        type: String,
        default: ''
    },
    link: {
        type: String //if video
    },
    type: {
        /*
            -1 if video
            0 if single image
            1 if compared images with before and after
        */
        type: Number
    },
    sub_group: {
        type: Schema.Types.ObjectId,
        ref: 'sub_group'
    },
    img_before: {
        type: String
    },
    img_after: {
        type: String
    },
    img_before_thumbnail: {
        type: String
    },
    img_after_thumbnail: {
        type: String
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('post', postSchema);
