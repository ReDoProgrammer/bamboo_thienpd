const router = require('express').Router();
const { authenticateToken } = require('../../middlewares/authenticate');
const Group = require('../../models/group_model');



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

router.get('/list', authenticateToken, async (req, res) => {
   let groups = await Group.find({});
    return res.status(200).json({
        msg:`Load services list successfully!`,
        groups
    })
})

router.put('/',authenticateToken,async (req,res)=>{
    let {id,name,type,metatitle,order} = req.body;
    
    let g = await Group.findById(id);
    if(!g){
        return res.status(404).json({
            msg:`Group not found!`
        })
    }

    g.name = name;
    g.type = type;
    g.metatitle = metatitle;
    g.order =order;
    await g.save()
    .then(_=>{
        return res.status(200).json({
            msg:`The group has been updated successfully!`
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Can not update this group with error: ${new Error(err.message)}`
        })
    })
})

router.delete('/',authenticateToken,(req,res)=>{
    let id = req.body.id;
    Group.findOneAndDelete({_id:id},async (err,group)=>{
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

router.post('/',authenticateToken, async (req,res)=>{
    let {name,type,metatitle,order} = req.body;
    let g = new Group({name,type,metatitle,order});
  
    await g.save()
    .then(_=>{
        return res.status(201).json({
            msg:`Create a new service successfully!`
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Can not create service with error: ${new Error(err.message)}`
        })
    })
})

module.exports = router;


