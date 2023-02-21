const router = require('express').Router();
const {authenticateToken} = require('../../middlewares/authenticate');

router.get('/',(req,res)=>{
    res.render('admin/home/index',{
        name:'Home',
        layout:'layouts/admin_layout'
    });
})

router.get('/login',(req,res)=>{
    res.render('admin/home/login',{
        name:'Login',
        layout:'admin/home/login'
    });
})

router.get('/check-token',authenticateToken,async (req,res)=>{
    console.log(req)
})


module.exports = router;