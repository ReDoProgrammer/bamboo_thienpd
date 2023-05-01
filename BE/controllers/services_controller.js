const router = require('express').Router();
const Config = require('../models/config_model');
const Service = require('../models/group_model');

router.get('/',(req,res)=>{
    res.render('services/index',{
        layout:'layouts/fe_layout',
        name:'Sevices list'
    });
})

router.get('/load-services',async (req,res)=>{
    let services = await Service.find();
    return res.status(200).json({
        msg:`Load services list successfully!`,
        services
    })
})

router.get('/get-backgroud',async (req,res)=>{
    let cf = await Config.findOne({key:'services_background'});
    if(!cf){
        return res.status(404).json({
            msg:`Config services background not found!`
        })
    }

    return res.status(200).json({
        msg:`Get services background config successfully!`,
        cf
    })
})


module.exports = router;