const router = require('express').Router();
const { authenticateToken } = require('../../middlewares/authenticate');
const Config = require('../../models/config_model');

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require('sharp');
const BANNER_STORAGE = "/images/GUI/banner/";
const LOGO_STORAGE = "/images/GUI/logo/";
const WWD_STORAGE = "/images/GUI/wwd/";
const SERVICES_BACKGROUND_STORAGE = "/images/GUI/services_background/";
const HCWH_STORAGE = "/images/GUI/how_can_we_help/";
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
var storage_logo = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/GUI/logo");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});
var storage_wwd = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/GUI/wwd");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});
var storage_services_background = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/GUI/services_background");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const storage_hcwh = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/GUI/how_can_we_help')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + `_${file.originalname}`)
    }
})


const upload = multer({ storage: storage }).single("banner");
const uploadlogo = multer({ storage: storage_logo }).single("logo");
const uploadwwd = multer({ storage: storage_wwd }).single("thumbnail");
const uploadservicesbackground = multer({ storage: storage_services_background }).single("background");

const uploadhcwh = multer({ storage: storage_hcwh })
const uploadMultiple = uploadhcwh.fields([{ name: 'img_1st', maxCount: 1 }, { name: 'img_2nd', maxCount: 1 }, { name: 'img_3rd', maxCount: 1 }]);





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


router.get('/logo', (req, res) => {
    res.render('admin/config/logo', {
        name: 'Setting logo',
        layout: 'layouts/admin_layout'
    });
})

router.get('/load-logo', authenticateToken, (req, res) => {
    LoadConfig('logo')
        .then(logo => {
            return res.status(200).json({
                msg: `Load logo successfully!`,
                logo
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Can not load logo with error: ${new Error(err.message)}`
            })
        })

})

router.post('/logo', authenticateToken, (req, res) => {
    uploadlogo(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.log(`Lỗi upload logo  ${err.message}`);
            return res.status(500).json({
                msg: `upload banner failed with error: ${err.message}`,
                error: err.message,
            });
        }
        if (err) {
            console.log(`Lỗi upload logo: ${err.message}`);
            res.status(500).json({
                msg: `Upload logo failed with error:${err.message}`,
                error: err.message,
            });
        }

        fs.copyFile.value = LOGO_STORAGE + req.file.filename;

        let cf = await Config.findOne({ key: 'logo' });

        if (cf) {
            UpdateConfig('logo', LOGO_STORAGE + req.file.filename)
                .then(_ => {
                    return res.status(201).json({
                        msg: `Upload logo successfully!`
                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        msg: `Can not upload logo with error: ${err.message}`
                    })
                })
        } else {
            cf = new Config();
            cf.key = 'logo';
            cf.value = LOGO_STORAGE + req.file.filename;

            CreateConfig('logo', LOGO_STORAGE + req.file.filename)
                .then(_ => {
                    return res.status(201).json({
                        msg: `Upload logo successfully!`
                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        msg: `Can not upload logo with error: ${err.message}`
                    })
                })
        }

    });
})





router.get('/banner', (req, res) => {
    res.render('admin/config/banner', {
        name: 'Setting homepage banner',
        layout: 'layouts/admin_layout'
    });
})

router.get('/load-banner', authenticateToken, (req, res) => {
    Promise.all([LoadConfig('banner'), LoadConfig('banner_title'), LoadConfig('banner_description')])
        .then(cfs => {
            return res.status(200).json({
                msg: `Load banner information successfully!`,
                cfs
            })
        })
        .catch(err => {
            return res.status(err.code).json({
                msg: err.msg
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


router.get('/what-we-do', (req, res) => {
    res.render('admin/config/what_we_do', {
        name: 'Config what we do content',
        layout: 'layouts/admin_layout'
    });
})

router.post('/what-we-do', authenticateToken, (req, res) => {
    uploadwwd(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.log(`Lỗi upload what-we-do  ${err.message}`);
            return res.status(500).json({
                msg: `upload what-we-do failed with error: ${err.message}`,
                error: err.message,
            });
        }
        if (err) {
            console.log(`Lỗi upload what-we-do: ${err.message}`);
            res.status(500).json({
                msg: `Upload what-we-do failed with error:${err.message}`,
                error: err.message,
            });
        }

        fs.copyFile.value = WWD_STORAGE + req.file.filename;

        let { content } = req.body;
        let cf = await Config.findOne({ key: 'wwd_thumbnail' });

        if (cf) {
            Promise.all([UpdateConfig('wwd_thumbnail', WWD_STORAGE + req.file.filename), UpdateConfig('wwd_content', content)])

                .then(_ => {
                    return res.status(201).json({
                        msg: `Upload what we do successfully!`
                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        msg: `Can not upload what we do with error: ${err.message}`
                    })
                })
        } else {
            Promise.all([CreateConfig('wwd_thumbnail', WWD_STORAGE + req.file.filename), CreateConfig('wwd_content', content)])
                .then(_ => {
                    return res.status(201).json({
                        msg: `Create what-we-do content successfully!`
                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        msg: `Can not create what-we-do content with error: ${err.message}`
                    })
                })
        }

    });
})

router.get('/load-what-we-do', authenticateToken, (req, res) => {
    Promise.all([LoadConfig('wwd_thumbnail'), LoadConfig('wwd_content')])
        .then(cfs => {
            return res.status(200).json({
                msg: `Load what we do content successfully!`,
                cfs
            })
        })
        .catch(err => {
            return res.status(err.code).json({
                msg: err.msg
            })
        })

})


router.get('/services-background', (req, res) => {
    res.render('admin/config/services-background', {
        name: 'Config Services background',
        layout: 'layouts/admin_layout'
    });
})


router.post('/services-background', authenticateToken, (req, res) => {
    uploadservicesbackground(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.log(`Lỗi upload services background  ${err.message}`);
            return res.status(500).json({
                msg: `upload services background failed with error: ${err.message}`,
                error: err.message,
            });
        }
        if (err) {
            console.log(`Lỗi upload services background: ${err.message}`);
            res.status(500).json({
                msg: `Upload services background failed with error:${err.message}`,
                error: err.message,
            });
        }

        fs.copyFile.value = SERVICES_BACKGROUND_STORAGE + req.file.filename;

        let cf = await Config.findOne({ key: 'services_background' });

        if (cf) {
            UpdateConfig('services_background', SERVICES_BACKGROUND_STORAGE + req.file.filename)
                .then(_ => {
                    return res.status(201).json({
                        msg: `Upload SERVICES_BACKGROUND_STORAGE successfully!`
                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        msg: `Can not upload SERVICES_BACKGROUND_STORAGE with error: ${err.message}`
                    })
                })
        } else {
            cf = new Config();
            cf.key = 'services_background';
            cf.value = SERVICES_BACKGROUND_STORAGE + req.file.filename;

            CreateConfig('services_background', SERVICES_BACKGROUND_STORAGE + req.file.filename)
                .then(_ => {
                    return res.status(201).json({
                        msg: `Upload SERVICES_BACKGROUND_STORAGE successfully!`
                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        msg: `Can not upload SERVICES_BACKGROUND_STORAGE with error: ${err.message}`
                    })
                })
        }

    });
})
router.get('/load-services-background', authenticateToken, (req, res) => {
    LoadConfig('services_background')
        .then(bg => {
            return res.status(200).json({
                msg: `Load services background successfully!`,
                bg
            })
        })
        .catch(err => {
            return res.status(err.code).json({
                msg: err.msg
            })
        })

})


router.get('/how-can-we-help', (req, res) => {
    res.render('admin/config/how-can-we-help', {
        name: 'Config how can we help',
        layout: 'layouts/admin_layout'
    });
})

router.post('/how-can-we-help', authenticateToken, (req, res) => {

    uploadMultiple(req, res, async (err) => {
        if (err) {
            return res.status(500).json({
                msg: `${new Error(err.message)}`
            });
        }

        //reduce image before & image after to thumbnail
        Promise.all([
            ReduceImageSize(req.files.img_1st[0]),
            ReduceImageSize(req.files.img_2nd[0]),
            ReduceImageSize(req.files.img_3rd[0])
        ])
            .then(async fileNames => {
                let { description } = req.body;
                let chk = await Config.findOne({key:'hcwh_description'});
                console.log({fileNames,chk});
                if(chk !==null){
                    Promise.all([UpdateConfig("hcwh_description",description),UpdateConfig("hcwh_img_1st",HCWH_STORAGE+fileNames[0]),UpdateConfig("hcwh_img_2nd",HCWH_STORAGE+fileNames[1]),UpdateConfig("hcwh_img_3rd",HCWH_STORAGE+fileNames[2])])
                    .then(_=>{
                        return res.status(201).json({
                            msg:`Change how-can-we-help content successfully!`
                        })
                    })
                    .catch(err=>{
                        return res.status(500).json({
                            msg:`Can not change how-can-we-help content with error: ${new Error(err.message)}`
                        })
                    })
                }else{
                    console.log(0);
                    Promise.all([CreateConfig("hcwh_description",description),CreateConfig("hcwh_img_1st",HCWH_STORAGE+fileNames[0]),CreateConfig("hcwh_img_2nd",HCWH_STORAGE+fileNames[1]),CreateConfig("hcwh_img_3rd",HCWH_STORAGE+fileNames[2])])
                    .then(_=>{
                        return res.status(201).json({
                            msg:`Change how-can-we-help content successfully!`
                        })
                    })
                    .catch(err=>{
                        return res.status(500).json({
                            msg:`Can not change how-can-we-help content with error: ${err}`
                        })
                    })
                }
               
            })
            .catch(err => {
                return res.status(500).json({
                    msg:`Can not change how-can-we-help content with error: ${new Error(err)}`
                })
            })
    });
})


router.get('/load-how-can-we-help',authenticateToken,(req,res)=>{
    Promise.all([LoadConfig('hcwh_description'),LoadConfig('hcwh_img_1st'),LoadConfig('hcwh_img_2nd'),LoadConfig('hcwh_img_3rd')])
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

router.get('/our-portfolio', (req, res) => {
    res.render('admin/config/our-portfolio', {
        name: 'Config Our portfolio',
        layout: 'layouts/admin_layout'
    });
})

router.get('/photo-editing-pricing', (req, res) => {
    res.render('admin/config/pricing', {
        name: 'Config photo editing pricing',
        layout: 'layouts/admin_layout'
    });
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
                code: 404,
                error: new Error(`Config not found!`)
            })
        return resolve(cf);
    })
}

const ReduceImageSize = (file) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fileName = "thumbnail_" + new Date().getTime() + file.originalname;
            fs.access("./public/images/GUI/how_can_we_help", (err) => {
                if (err) {
                    fs.mkdirSync("./public/images/GUI/how_can_we_help");
                }
            });
            await sharp(file.path)
                .resize({
                    width: 200,
                    height: 135,
                })
                .toFile(
                    "./public/images/GUI/how_can_we_help/" + fileName
                );
            return resolve(fileName);
        } catch (err) {
            return reject(new Error(err.message));
        }
    })
}
