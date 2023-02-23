require('dotenv').config();
const fs = require('fs');
const path = require("path");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SubGroup = require('./sub_group_model');

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
postSchema.pre("save", async function(next) {
    var p = this;
    let sub = await SubGroup.findById(p.sub_group);
    sub.posts.push(p._id);
    await sub.save()
    .then(_=>{
        next();
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Can not push this post into sub group with error: ${err.message}`
        })
    })
   
});

postSchema.pre("remove", async function(next) {
    var p = this;
    if(p.img_before && p.img_before.trim().length>0){
        fs.unlinkSync(path.join("public",p.img_before));
        fs.unlinkSync(path.join("public",p.img_after));
        fs.unlinkSync(path.join("public",p.img_before_thumbnail));
        fs.unlinkSync(path.join("public",p.img_after_thumbnail));
    }

    if(p.img_url && p.img_url.trim().length >0){
        fs.unlinkSync(path.join("public",p.img_url));
    }

    let sub = await SubGroup.findById(p.sub_group);
    sub.posts.pull(p._id);
    await sub.save()
    .then(_=>{
        next();
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Can not push this post into sub group with error: ${err.message}`
        })
    })
   
});

module.exports = mongoose.model('post', postSchema);
