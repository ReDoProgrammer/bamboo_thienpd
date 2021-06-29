const router = require('express').Router();
const {authenticateToken} = require('../../middlewares/authenticate');

router.get('/',(req,res)=>{
    res.render('admin/home/index',{
        name:'Home',
        layout:'layouts/admin_layout'
    });
})


module.exports = router;