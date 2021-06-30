const router = require('express').Router();
const Slider = require('../models/slider_model');
const Group = require('../models/group_model');
const SubGroup = require('../models/sub_group_model');
const Post = require('../models/post_model');
const FAQ = require('../models/faq_model');
const Config = require('../models/config_model');
const ServicePack = require('../models/service_pack_model');


router.get('/', (req, res) => {
    res.render('home/index', {
        layout: 'layouts/fe_layout'
    });
})

router.get('/category/:group/:sub_group', (req, res) => {
    let { group, sub_group } = req.params;
    Group.findOne({ metatitle: group })
        .exec()
        .then(gr => {
            if (!gr) {
                return res.render('layouts/404', {
                    layout: 'layouts/404'
                });
            }
            SubGroup.findOne({
                group: gr._id,
                metatitle: sub_group
            })
                .exec()
                .then(sg => {
                    if (!sg) {
                        return res.render('layouts/404', {
                            layout: 'layouts/404'
                        });
                    }

                    res.render('post/index', {
                        layout: 'layouts/fe_layout',
                        sgId: sg._id
                    });

                })
                .catch(err => {

                })
        })
        .catch(err => {

        })
})

router.get('/contact', (req, res) => {
    let { key } = req.query;
    Config.findOne({ key: key })
        .exec()
        .then(config => {
            if (!config) {
                return res.status(404).json({
                    msg: `Contact not found!`
                })
            }
            return res.status(200).json({
                msg: `Load contact info successfully`,
                config: config
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Can not get contact info. ${new Error(err.message)}`
            })
        })

})


router.get('/faq', (req, res) => {
    FAQ.find({})
        .exec()
        .then(faqs => {
            return res.status(200).json({
                msg: `Load faq list successfully!`,
                faqs: faqs
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Can not load faq list. ${new Error(err.message)}`,
                error: new Error(err.message)
            })
        })
})



router.get('/group', (req, res) => {
    Group.find({})
        .populate('subs', 'name metatitle')
        .sort({ order: 1 })
        .exec()
        .then(groups => {
            return res.status(200).json({
                msg: 'Load groups list successfully!',
                groups: groups
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Can not load groups list. Error: ${new Error(err.message)}`
            })
        })
})

router.get('/service-pack', (req, res) => {
    ServicePack.find()
        .exec()
        .then(sps => {
            return res.status(200).json({
                msg: `Load service packs list successfully!`,
                sps: sps
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Can not get service pack list. ${new Error(err.message)}`,
                error: `${new Error(err.message)}`
            })
        })
})

router.get('/slider', (req, res) => {
    Slider.find({})
        .then(sliders => {
            return res.status(200).json({
                msg: 'Load slider successfully!',
                sliders: sliders
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Can not load sliders. Catch error: ${new Error(err.message)}`
            })
        })
})

router.get('/sub-group-with-avatar', (req, res) => {
    SubGroup.find({ is_shown: true })
        .populate('group', 'metatitle')
        .exec()
        .then(sgs => {
            return res.status(200).json({
                msg: `Load shown avtar subgroups list successfully!`,
                sgs: sgs
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Can not load subgroup list that is shown! ${new Error(err.message)}`,
                error: `${new Error(err.message)}`
            })
        })
})

router.get('/frequently-asked-questions',(req,res)=>{
    res.render('FAQs/index', {
        layout: 'layouts/fe_layout'
    });
})

module.exports = router;