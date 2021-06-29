const router = require('express').Router();
const TrialOrder = require('../models/trial_order_model');

router.post('/',(req,res)=>{
    let {name,email,link,comment} = req.body;

    let trialOrder = new TrialOrder({
        name,
        email,
        link,
        comment
    });

    trialOrder.save()
    .then(trial_order=>{
        return res.status(201).json({
            msg:'Send trial order successfully!',
            trial_order:trial_order
        })
    })
    .catch(err=>{
        console.log(new Error(err.message));
        return res.status(500).json({
            msg:`Can not send trial order. ${new Error(err.message)}`
        })
    })

})


module.exports = router;