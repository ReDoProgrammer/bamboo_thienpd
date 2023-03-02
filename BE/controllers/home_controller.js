const router = require('express').Router();
const Slider = require('../models/slider_model');
const Group = require('../models/group_model');
const SubGroup = require('../models/sub_group_model');
const Post = require('../models/post_model');
const FAQ = require('../models/faq_model');
const Config = require('../models/config_model');
const Pricing = require('../models/pricing');


router.get('/', (req, res) => {
    res.render('home/index', {
        layout: 'layouts/_layout',
        name: 'Homepage'
    });
})

router.get('/price',(req,res)=>{
    res.render('home/pricing', {
        layout: 'layouts/_layout',
        name:'Photo editing price'
    });
})


router.get('/contact-us',(req,res)=>{
    res.render('home/contact', {
        layout: 'layouts/_layout',
        name:'Contact and about'
    });
})


router.get('/how-it-works',(req,res)=>{
    res.render('home/how-it-works', {
        layout: 'layouts/_layout',
        name:'How it works'
    });
})



router.get('/frequently-asked-questions',(req,res)=>{
    res.render('home/frequently-asked-questions', {
        layout: 'layouts/_layout',
        name:'FAQs'
    });
})

router.get('/why-choose-us',(req,res)=>{
    res.render('home/why-choose-us', {
        layout: 'home/why-choose-us',
        name:'Why choose us'
    });
})

router.get('/blog',(req,res)=>{
    res.render('home/blog', {
        layout: 'layouts/_layout',
        name:'Blogs'
    });
})

router.get('/services/:group/:sub_group', (req, res) => {
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
                        layout: 'layouts/_layout',
                        sgId: sg._id
                    });

                })
                .catch(err => {

                })
        })
        .catch(err => {

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

router.get('/load-subs-by-group',async (req,res)=>{
    let {group} = req.query;
    await SubGroup.find({group:group})
    .then(subs=>{
        return res.status(200).json({
            msg:`Load subs by group ${group} successfully`,
            subs
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Can not get subs by group with error: ${err.message}`
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


router.get('/load-logo',(req,res)=>{
    LoadConfig('logo')
    .then(logo=>{
        return res.status(200).json({
            msg:`Load logo successfully!`,
            logo
        })        
    })
    .catch(err=>{
        return res.status(err.code).json({
            msg: err.msg
        })
    })
})

router.get('/load-what-we-do',(req,res)=>{
    Promise.all([LoadConfig('wwd_thumbnail'),LoadConfig('wwd_content')])   
    .then(cfs=>{
        return res.status(200).json({
            msg:`Load wwd content successfully!`,
            cfs
        })        
    })
    .catch(err=>{
        return res.status(err.code).json({
            msg: err.msg
        })
    })
})

router.get('/load-banner',async (req,res)=>{

    Promise.all([LoadConfig('banner'),LoadConfig('banner_title'),LoadConfig('banner_description')])   
    .then(cfs=>{
        return res.status(200).json({
            msg:`Load banner successfully!`,
            cfs
        })        
    })
    .catch(err=>{
        return res.status(err.code).json({
            msg: err.msg
        })
    })
})


router.get('/load-services-background',(req,res)=>{
    LoadConfig('services_background')
    .then(bg=>{
        return res.status(200).json({
            msg:`Load services background successfully!`,
            bg
        })        
    })
    .catch(err=>{
        return res.status(err.code).json({
            msg: err.msg
        })
    })
})

router.get('/load-how-can-we-help',(req,res)=>{
    Promise.all([LoadConfig('hcwh_img_1st'),LoadConfig('hcwh_img_2nd'),LoadConfig('hcwh_img_3rd'),LoadConfig('hcwh_description')])
    .then(content=>{
        return res.status(200).json({
            msg:`Load how-can-we-help content successfully!`,
            content
        })
    })
    .catch(err=>{
        return res.status(err.code).json({
            msg:err.msg
        })
    })
})

module.exports = router;

const LoadConfig = key=>{
    return new Promise(async (resolve,reject)=>{
       let cf = await Config.findOne({key:key});
       if(!cf){
        return reject({
            code:404,
            msg:`Config ${key} not found!`
        })        
       }
       return resolve(cf);
    })
}