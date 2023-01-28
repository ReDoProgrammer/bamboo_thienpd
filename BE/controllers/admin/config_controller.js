const router = require('express').Router();
const { authenticateToken } = require('../../middlewares/authenticate');
const Config = require('../../models/config_model');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const BANNER_STORAGE = "/images/GUI/banner/";
require("dotenv").config();

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/GUI/banner");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});
const upload = multer({ storage: storage }).single("banner");





router.put('/', authenticateToken, (req, res) => {
    let { id, key, description, value, active } = req.body;
    Config.findOneAndUpdate({ _id: id }, {
        description,
        value,
        active
    }, { new: true }, (err, config) => {
        if (err) {
            return res.status(500).json({
                msg: `Update config failed. ${new Error(err.message)}`,
                error: new Error(err.message)
            })
        }
        if (!config) {
            return res.status(404).json({
                msg: `Config key not match!`
            })
        }

        return res.status(200).json({
            msg: `Update config successfully`,
            config: config
        })
    })


    router.get('/', authenticateToken, (req, res) => {
        res.render('admin/config/index', {
            name: 'Config',
            layout: 'layouts/admin_layout'
        });
    })

    router.get('/list', authenticateToken, (req, res) => {
        Config.find({})
            .then(configs => {
                return res.status(200).json({
                    msg: 'Load config list successfully',
                    configs: configs
                })
            })
            .catch(err => {
                msg: `Load configs list failed. ${new Error(err.message)}`
            })
    })

    router.get('/detail', authenticateToken, (req, res) => {
        let { key } = req.query;
        Config.findOne({ key: key })
            .exec()
            .then(config => {
                if (!config) {
                    return res.status(404).json({
                        msg: 'Config not match'
                    })
                }
                return res.status(200).json({
                    msg: 'Load config successfully',
                    config: config
                })
            })
            .catch(err => {
                return res.status(500).json({
                    msg: `${new Error(err.message)}`
                })
            })
    })
})

router.get('/banner', (req, res) => {
    res.render('admin/config/banner', {
        name: 'Setting homepage banner',
        layout: 'layouts/admin_layout'
    });
})

router.get('/load-banner', authenticateToken, (req, res) => {
    Promise.all([LoadConfig('banner'),LoadConfig('banner_title'),LoadConfig('banner_description')])
    .then(cfs=>{
        return res.status(200).json({
            msg:`Load banner information successfully!`,
            cfs
        })        
    })
    .catch(err=>{
        return res.status(err.code).json({
            msg:err.msg
        })
    })

})

router.post('/banner', authenticateToken, (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.log(`Lỗi upload banner  ${err.message}`);
            return res.status(500).json({
                msg: `upload banner failed with error: ${err.message}`,
                error: err.message,
            });
        }
        if (err) {
            console.log(`Lỗi upload banner: ${err.message}`);
            res.status(500).json({
                msg: `Upload banner failed with error:${err.message}`,
                error: err.message,
            });
        }

        fs.copyFile.value = BANNER_STORAGE + req.file.filename;

        let { title, description } = req.body;

        let cf = await Config.findOne({ key: 'banner' });

        if (cf) {
            Promise.all([UpdateConfig('banner', BANNER_STORAGE + req.file.filename), UpdateConfig('banner_title', title), UpdateConfig('banner_description', description)])
                .then(_ => {
                    return res.status(201).json({
                        msg: `Upload banner successfully!`
                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        msg: `Can not upload banner with error: ${err.message}`
                    })
                })
        } else {
            cf = new Config();
            cf.key = 'banner';
            cf.value = BANNER_STORAGE + req.file.filename;

            Promise.all([CreateConfig('banner', BANNER_STORAGE + req.file.filename), CreateConfig('banner_title', title), CreateConfig('banner_description', description)])
                .then(_ => {
                    return res.status(201).json({
                        msg: `Upload banner successfully!`
                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        msg: `Can not upload banner with error: ${err.message}`
                    })
                })
        }

    });
})

router.get('/init', (req, res) => {
    Config.countDocuments({}, (err, count) => {
        if (err) {
            return res.satus(500).json({
                msg: `Can not count config with error: ${new Error(err.message)}`
            })
        }
        if (count == 0) {
            let configs = [
                { key: 'phone', description: 'Phone', value: '0911.39.77.64' },
                { key: 'hotline', description: 'Hotline', value: '0911.39.77.64' },
                { key: 'facebook', description: 'Facebook', value: 'https://www.fb.com/redodht' },
                { key: 'twitter', description: 'Twitter', value: '' },
                { key: 'contact', description: 'Contact', value: 'contact@bamboophoto.com' },
                { key: 'sale', description: 'Sale', value: 'sale@bamboophoto.com' },
                { key: 'skype', description: 'Skype', value: 'redoprogrammer' }
            ]

            Config.insertMany(configs, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        msg: `Can not init config with error: ${new Error(err.message)}`,
                        error: new Error(err.message)
                    })
                }
                return res.status(201).json({
                    msg: `Initialize configs successfully`,
                    configs: result
                })
            })
        }
    })
})

router.get('/', (req, res) => {
    res.render('admin/config/index', {
        name: 'Config',
        layout: 'layouts/admin_layout'
    });
})

router.get('/list', authenticateToken, (req, res) => {
    Config.find({})
        .exec()
        .then(configs => {
            return res.status(200).json({
                msg: 'Load configs list successfully',
                configs: configs
            })
        })
})

router.get('/detail', authenticateToken, (req, res) => {
    let { id } = req.query;
    Config.findById(id)
        .exec()
        .then(config => {
            console.log(config);
            if (!config) {
                return res.status(404).json({
                    msg: `Config not found`
                })
            }
            return res.status(200).json({
                msg: `Load config successfully`,
                config: config
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `${new Error(err.message)}`
            })
        })
})


module.exports = router;

const CreateConfig = (key, value) => {
    return new Promise(async (resolve, reject) => {
        let cf = new Config();
        cf.key = key;
        cf.value = value;
        await cf.save()
            .then(_ => {
                return resolve();
            })
            .catch(err => {
                return reject(new Error(err.message))
            })
    })
}

const UpdateConfig = (key, value) => {
    return new Promise(async (resolve, reject) => {
        let cf = await Config.findOne({ key: key });
        if (!cf) {
            return reject({
                err: new Error('Config not found!')
            })
        }
        cf.value = value;
        await cf.save()
            .then(_ => {
                return resolve();
            })
            .catch(err => {
                return reject(new Error(err.message))
            })
    })
}

const LoadConfig = (key) => {
    return new Promise(async (resolve, reject) => {
        let cf = await Config.findOne({ key });
        if (!cf)
            return reject({
                code:404,
                error: new Error(`Config not found!`)
            })
        return resolve(cf);
    })
}