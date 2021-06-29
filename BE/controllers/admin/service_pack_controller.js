const router = require("express").Router();
const { authenticateToken } = require("../../middlewares/authenticate");
const ServicePackage = require("../../models/service_pack_model");

router.get('/', (req, res) => {
    res.render('admin/service_pack/index', {
        name: 'Service Pack',
        layout: 'layouts/admin_layout'
    });
})

router.get('/list', authenticateToken, (req, res) => {
    ServicePackage
        .find({})
        .exec()
        .then(sps => {
            return res.status(200).json({
                msg: `Load service packs list successfully`,
                sps: sps
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Can not load service packs. ${new Error(err.message)}`,
                error: `${new Error(err.message)}`
            })
        })
})

router.get('/detail', authenticateToken, (req, res) => {
    let { id } = req.query;
    ServicePackage
        .findById(id)
        .exec()
        .then(sp => {
            if (!sp) {
                return res.status(404).json({
                    msg: `Service pack not found!`
                })
            } else {
                return res.status(200).json({
                    msg: `Get service pack detail successfully!`,
                    sp: sp
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Can not get service pack detail. ${new Error(err.message)}`,
                error: `${new Error(err.message)}`
            })
        })
})

router.post('/', authenticateToken, (req, res) => {
    let { name, description, price } = req.body;
    let sp = new ServicePackage({
        name,
        description,
        price
    });
    sp.save()
        .then(sp => {
            return res.status(201).json({
                msg: `Created service pack successfully!`,
                sp: sp
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Can not create service pack. ${new Error(err.message)}`,
                error: `${new Error(err.message)}`
            })
        })

})

router.put('/', authenticateToken, (req, res) => {
    let {id,name,description,price} = req.body;
    ServicePackage.findByIdAndUpdate(id,{
        name,
        description,
        price
    },{new:true},(err,sp)=>{
        if(err){
            return res.status(500).json({
                msg:`Update service pack failed. ${new Error(err.message)}`,
                error:`${new Error(err.message)}`
            })
        }
        if(!sp){
            return res.status(404).json({
                msg:`Service pack not found!`
            })
        }else{
            return res.status(200).json({
                msg:`Update service pack successfully!`,
                sp:sp
            })
        }
    })
})

router.delete('/', authenticateToken, (req, res) => {
    let {id} = req.body;
    ServicePackage.findOneAndDelete(id,(err,sp)=>{
        if(err){
            return res.status(500).json({
                msg:`Can not delete service pack. ${new Error(err.message)}`,
                error:`${new Error(err.message)}`
            })
        }

        if(!sp){
            return res.status(404).json({
                msg:`Service pack not found!`
            })
        }else{
            return res.status(200).json({
                msg:`Deleted service pack successfully!`
            })
        }
    })
})


module.exports = router;