require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SubGroup = require('./sub_group_model');

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

groupSchema.pre('remove', async function(next) {
    await SubGroup.deleteMany({group: this._id}).exec();   
    next();
});

module.exports = mongoose.model('group',groupSchema);