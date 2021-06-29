const router = require('express').Router();
const Post = require('../models/post_model');
router.get('/',(req,res)=>{
    let {sgId} = req.query;
    Post
    .find({sub_group:sgId})
    .sort({
        created_date:-1
    })
    .exec()
    .then(posts=>{
        return res.status(200).json({
            msg:`Load posts list successfully!`,
            posts:posts
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Can not load posts list. ${new Error(err.message)}`,
            error:`${new Error(err.message)}`
        })
    })
})

module.exports = router;