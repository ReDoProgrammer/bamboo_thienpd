const router = require("express").Router();
const { authenticateToken } = require("../../middlewares/authenticate");
const Pricing = require("../../models/pricing");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const THUMBNAIL_ROOT = "/images/upload/pricing/";

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/upload/pricing");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage }).single("thumbnail");

router.get("/", (req, res) => {
  res.render("admin/pricing/index", {
    name: "Pricing",
    layout: "layouts/admin_layout",
  });
});

router.get("/list", authenticateToken, (req, res) => {
  Pricing.find({})
    .exec()
    .then((sps) => {
      return res.status(200).json({
        msg: `Load pricing list successfully`,
        sps: sps,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        msg: `Can not load pricing. ${new Error(err.message)}`,
        error: `${new Error(err.message)}`,
      });
    });
});

router.get("/detail", authenticateToken, (req, res) => {
  let { id } = req.query;
  Pricing.findById(id)
    .exec()
    .then((sp) => {
      if (!sp) {
        return res.status(404).json({
          msg: `Service pack not found!`,
        });
      } else {
        return res.status(200).json({
          msg: `Get service pack detail successfully!`,
          sp: sp,
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        msg: `Can not get service pack detail. ${new Error(err.message)}`,
        error: `${new Error(err.message)}`,
      });
    });
});

router.post("/", authenticateToken, async (req, res) => {

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(`Lỗi upload slider  ${err.message}`);
      return res.status(500).json({
        msg: `upload slider failed with error: ${new Errror(err.message)}`,
        error: err.message,
      });
    }
    if (err) {
      console.log(`Lỗi upload file: ${err.message}`);
      res.status(500).json({
        msg: `Upload file failed with error:${new Error(err.message)}`,
        error: err.message,
      });
    }

    let {name,description} = req.body;
    let thumbnail = req.file.filename;
    let pricing = new Pricing({
        name,
        description,
        thumbnail: THUMBNAIL_ROOT+thumbnail
    });

    pricing.save()
    .then(price=>{
        return res.status(201).json({
            msg:'Create a new pricing successfully!',
            price:price
        });
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Price can not created. ${new Error(err.message)}`            
        })
    })
   
  });
});

router.put("/", authenticateToken, (req, res) => {
  let { id, name, description, price } = req.body;
  Pricing.findByIdAndUpdate(
    id,
    {
      name,
      description,
      price,
    },
    { new: true },
    (err, sp) => {
      if (err) {
        return res.status(500).json({
          msg: `Update service pack failed. ${new Error(err.message)}`,
          error: `${new Error(err.message)}`,
        });
      }
      if (!sp) {
        return res.status(404).json({
          msg: `Service pack not found!`,
        });
      } else {
        return res.status(200).json({
          msg: `Update service pack successfully!`,
          sp: sp,
        });
      }
    }
  );
});

router.delete("/", authenticateToken, (req, res) => {
  let { id } = req.body;
  Pricing.findOneAndDelete({ _id: id })
  .then((price) => {
    try {
      fs.unlinkSync("./public" + price.thumbnail);
      return res.status(200).json({
        msg: "Delete price successfully!",
      });
    } catch (err) {
      return res.status(200).json({
        msg: "Delete price successfully!",
      });
    }
  })
  .catch((err) => {
    return res.status(500).json({
      msg: `Can not delete this price. Error: ${new Error(err.message)}`,
    });
  });
});

module.exports = router;
