require('dotenv').config();
const fs = require('fs');
const path = require("path");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Group = require('./group_model');
const subGroupSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please input sub group name']
    },
    metatitle: {
        type: String,
        unique: [true, 'This meta title is already exist']
    },
    description: {
        type: String
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'group'
    },
    thumbnail: {
        type: String,
        require: [true, 'Please choose thumbnail for this']
    },
    banner: {
        type: String
    },
    is_shown: {
        type: Boolean,
        default: true
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'post'
        }
    ]

});


subGroupSchema.pre("save", async function (next) {
    var s = this;
    console.log('pre saving',s)
    let g = await Group.findById(s.group);
    g.subs.push(s._id);
    await g.save()
        .then(_ => {
            next();
        })
        .catch(err => {
            console.log(`Can not push sub into group with error: ${err.message}`);
        })

});

subGroupSchema.pre("remove", async function (next) {
    var s = this;
    console.log('delete',s);
    fs.unlinkSync(path.join("public", s.thumbnail));
    fs.unlinkSync(path.join("public", s.banner));

    let g = await Group.findById(s.group);
    g.subs.pull(s._id);
    await g.save();
    next();
       

});

module.exports = mongoose.model('sub_group', subGroupSchema);


