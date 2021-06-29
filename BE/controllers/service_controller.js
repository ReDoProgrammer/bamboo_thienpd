const router = require('express').Router();


router.get('/',(req,res)=>{
    res.render('service/index',{
        layout:'layouts/fe_layout'
    });
})


module.exports = router;