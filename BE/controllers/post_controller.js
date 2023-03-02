const router = require('express').Router();
const SubGroup = require('../models/sub_group_model');
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
        SubGroup.findById(sgId,(err,sg)=>{
            if(err){
                return res.status(500).json({
                    msg:`${new Error(err.message)}`
                })
            }
            if(!sg){
                return res.status(404).json({
                    msg:`Subgroup not found`                    
                })
            }
            return res.status(200).json({
                msg:`Load posts list successfully!`,
                posts:posts,
                sg:sg
            })
        })
       
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Can not load posts list. ${new Error(err.message)}`,
            error:`${new Error(err.message)}`
        })
    })
})


router.get('/list-6latest-posts',async (req,res)=>{
    let posts = await Post
    .find({})
    .sort({created_date:-1})
    .populate()
})

module.exports = router;