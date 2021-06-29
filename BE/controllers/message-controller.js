const router = require('express').Router();
const Message = require('../models/message_model');

router.post('/',(req,res)=>{
    let {name,email,message} = req.body;

    let mess = new Message({
        name,
        email,
        message
    });

    mess.save()
    .then(message=>{
        return res.status(201).json({
            msg:'Thanks for your message!',
            message:message
        })
    })
    .catch(err=>{      
        return res.status(500).json({
            msg:`${new Error(err.message)}`
        })
    })

})


module.exports = router;