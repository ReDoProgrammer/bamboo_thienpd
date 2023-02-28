const router = require('express').Router();


router.get('/',(req,res)=>{
    res.render('pricing/index',{
        layout:'layouts/_layout',
        name:'Photo editing pricing'
    });
})


module.exports = router;