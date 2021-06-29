const router = require('express').Router();
const { authenticateToken } = require('../../middlewares/authenticate');
const Group = require('../../models/group_model');
router.get('/', (req, res) => {
    res.render('admin/group/index', {
        name: 'Group',
        layout: 'layouts/admin_layout'
    });
})


router.get('/list', authenticateToken, (req, res) => {
    Group.find({})
        .then(groups => {
            return res.status(200).json({
                msg: 'Load groups list successfully!',
                groups: groups
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: 'Can not load groups list',
                error: new Error(err)
            })
        })
})

router.get('/detail',authenticateToken,(req,res)=>{

    Group.findById(req.query.id,(err,group)=>{
        if(err){
            return res.status(500).json({
                msg:'Can not get group detail',
                error:new Error(err)
            });
        }

        if(!group){
            return res.status(404).json({
                msg:'Group not found'
            });
        }else{
            return res.status(200).json({
                msg:'Get group detail successfully!',
                group:group
            });
        }

    })
})



router.post('/', authenticateToken, (req, res) => {
    let { name, metatitle,order } = req.body;
    if (name.length == 0) {
        return res.status(403).json({
            msg: 'Group name can not be blank!'
        })
    }
    let group = new Group({
        name,
        metatitle,
        order
    });
    group.save()
        .then(g => {
            return res.status(201).json({
                msg: 'Created a new group successfully!',
                group: g
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `${new Error(err.message)}`,
                error: new Error(err)
            })
        })
})


router.put('/',authenticateToken,(req,res)=>{
    let {id,name,metatitle,order} = req.body;
    if(name.trim().length == 0){
        return res.status(403).json({
            msg:'Group name can not be blank!'
        })
    }
    Group.findOneAndUpdate({_id:id},{
        name,
        metatitle,
        order
    },{
        new:true
    },(err,group)=>{
        if(err){
            return res.status(500).json({
                msg:'Update group failed!',
                error:new Error(err)
            });
        }
        if(!group){
            return res.status(404).json({
                msg:'Group not found!'
            })
        }
        return res.status(200).json({
            msg:'Update group successfully!',
            group:group
        })
    })
})

router.delete('/',authenticateToken,(req,res)=>{
    let id = req.body.id;
    Group.findOneAndDelete({_id:id},(err,group)=>{
        if(err){
            return res.status(500).json({
                msg:'Can not delete this group!',
                error:new Error(err)
            });
        }
        else{
            if(!group){
                return res.status(404).json({
                    msg:'Group not found'
                });
            }else{
                return res.status(200).json({
                    msg:'Delete group successfully!'
                })
            }
        }
    })
   

})

module.exports = router;