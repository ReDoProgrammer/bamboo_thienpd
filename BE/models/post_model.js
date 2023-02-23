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
    video_url: {
        type: String //if video
    },
    img_url: {
        type: String //if single image
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
