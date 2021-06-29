const router = require('express').Router();
const { authenticateToken } = require('../../middlewares/authenticate');
const Config = require('../../models/config_model');



router.put('/',authenticateToken,(req,res)=>{
    let {id,key,description,value,active} = req.body;
    Config.findOneAndUpdate({_id:id},{
        description,
        value,
        active
    },{new:true},(err,config)=>{
        if(err){
            return res.status(500).json({
                msg:`Update config failed. ${new Error(err.message)}`,
                error:new Error(err.message)
            })
        }
        if(!config){
            return res.status(404).json({
                msg:`Config key not match!`
            })
        }

        return res.status(200).json({
            msg:`Update config successfully`,
            config:config
        })
    })


    router.get('/',authenticateToken,(req,res)=>{
        res.render('admin/config/index', {
            name: 'Config',
            layout: 'layouts/admin_layout'
        });
    })

    router.get('/list',authenticateToken,(req,res)=>{
        Config.find({})
        .then(configs=>{
            return res.status(200).json({
                msg:'Load config list successfully',
                configs:configs
            })
        })
        .catch(err=>{
            msg:`Load configs list failed. ${new Error(err.message)}`
        })
    })

    router.get('/detail',authenticateToken,(req,res)=>{
        let {key} = req.query;
        Config.findOne({key:key})
        .exec()
        .then(config=>{
            if(!config){
                return res.status(404).json({
                    msg:'Config not match'
                })
            }
            return res.status(200).json({
                msg:'Load config successfully',
                config:config
            })
        })
        .catch(err=>{
            return res.status(500).json({
                msg:`${new Error(err.message)}`
            })
        })
    })
})


router.get('/init',(req,res)=>{
    Config.countDocuments({},(err,count)=>{
        if(err){
            return res.satus(500).json({
                msg:`Can not count config with error: ${new Error(err.message)}`
            })
        }
        if(count == 0){
            let configs = [
                {key:'phone',description:'Phone',value:'0911.39.77.64'},
                {key:'hotline',description:'Hotline',value:'0911.39.77.64'},
                {key:'facebook',description:'Facebook',value:'https://www.fb.com/redodht'},
                {key:'twitter',description:'Twitter',value:''},
                {key:'contact',description:'Contact',value:'contact@bamboophoto.com'},
                {key:'sale',description:'Sale',value:'sale@bamboophoto.com'},               
                {key:'skype',description:'Skype',value:'redoprogrammer'}               
            ]

            Config.insertMany(configs,(err,result)=>{
                if(err){
                    return res.status(500).json({
                        msg:`Can not init config with error: ${new Error(err.message)}`,
                        error:new Error(err.message)
                    })
                }
                return res.status(201).json({
                    msg:`Initialize configs successfully`,
                    configs:result
                })
            })
        }
    })
})

router.get('/', (req, res) => {
    res.render('admin/config/index', {
        name: 'Config',
        layout: 'layouts/admin_layout'
    });
})

router.get('/list',authenticateToken,(req,res)=>{
    Config.find({})
    .exec()
    .then(configs=>{
        return res.status(200).json({
            msg:'Load configs list successfully',
            configs:configs
        })
    })
})

router.get('/detail',authenticateToken,(req,res)=>{
    let {id} = req.query;
    Config.findById(id)
    .exec()
    .then(config=>{
        console.log(config);
        if(!config){
            return res.status(404).json({
                msg:`Config not found`
            })       
        }
        return res.status(200).json({
            msg:`Load config successfully`,
            config:config
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`${new Error(err.message)}`
        })
    })
})


module.exports = router;