require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./post_model');
const Group = require('./group_model');
const subGroupSchema = new Schema({
    name:{
        type:String,
        required: [true, 'Please input sub group name']
    },
    metatitle:{
        type:String,
        unique:[true, 'This meta title is already exist']
    },
    description:{
        type:String
    },
    group:{
        type:Schema.Types.ObjectId,
        ref:'group'
    },
    thumbnail:{
        type:String,
        require:[true,'Please choose thumbnail for this']
    },
    banner:{
        type:String
    },
    is_shown:{
        type:Boolean,
        default:false
    }, 
    posts:[
        {
            type:Schema.Types.ObjectId,
            ref:'post'
        }
    ]    
});

subGroupSchema.pre('remove', async function(next) {
    await Group.findOneAndUpdate(
        { _id : this.group}, 
        { $pull: { subs: this._id } },
        { multi: true })  //if reference exists in multiple documents 
    .exec();
   await Post.deleteMany({sub_group: this._id}).exec();   
    next();
});



module.exports = mongoose.model('sub_group',subGroupSchema);
