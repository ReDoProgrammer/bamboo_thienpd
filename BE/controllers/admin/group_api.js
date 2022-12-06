const router = require('express').Router();
const { authenticateToken } = require('../../middlewares/authenticate');
const Group = require('../../models/group_model');


// router.get('/:group',authenticateToken,(req,res)=>{
//     res.render('admin/subgroup/index', {
//         name: 'Sub group',
//         layout: 'layouts/admin_layout'
//     });
// })

router.get('/list', authenticateToken, (req, res) => {
    Group.find({})
        .then(groups => {
            return res.status(200).json({
                msg: 'Load groups list successfully!',
                groups: groups
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: 'Can not load groups list',
                error: new Error(err)
            })
        })
})


module.exports = router;