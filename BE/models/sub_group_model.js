require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
    ],
    type: {
        /*
            -1 if video
            0 if single image
            1 if compared images with before and after
        */
        type: Number
    },    
});




module.exports = mongoose.model('sub_group',subGroupSchema);


