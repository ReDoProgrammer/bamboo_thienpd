const router = require('express').Router();
const { authenticateToken } = require('../../middlewares/authenticate');
const Group = require('../../models/group_model');
router.get('/', (req, res) => {
    res.render('admin/group/index', {
        name: 'Group',
        layout: 'layouts/admin_layout'
    });
})




module.exports = router;