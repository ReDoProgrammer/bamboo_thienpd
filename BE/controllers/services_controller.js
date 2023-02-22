const router = require('express').Router();


router.get('/',(req,res)=>{
    res.render('services/index',{
        layout:'layouts/fe_layout',
        name:'Sevices list'
    });
})


module.exports = router;