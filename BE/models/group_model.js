require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const groupSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please input group name']
    },
    metatitle: {
        type: String,
        required: [true, 'Metatitle can not be blank!'],
        index: true,
        unique:true
    },
    order:{
        type: Number,
        default:1
    },
    subs:
        [
            {
                type: Schema.Types.ObjectId,
                ref: 'sub_group'
            }
        ]

});

module.exports = mongoose.model('group',groupSchema);