const router = require('express').Router();


router.get('/',(req,res)=>{
    res.render('pricing/index',{
        layout:'layouts/fe_layout'
    });
})


module.exports = router;