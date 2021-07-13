const router = require("express").Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const SLIDER_ROOT = "/images/upload/sliders/";
const { authenticateToken } = require("../../middlewares/authenticate");
const Slider = require("../../models/slider_model");
require("dotenv").config();

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/upload/sliders");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage }).single("img_link");

router.get("/", (req, res) => {
  res.render("admin/slider/index", {
    name: "Slider",
    layout: "layouts/admin_layout",
  });
});

router.get("/list", authenticateToken, (req, res) => {
  Slider.find({})
    .then((sliders) => {
      return res.status(200).json({
        msg: "Load sliders list successfully!",
        sliders: sliders,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        msg: `Load sliders list failed with error: ${new Error(err.message)}`,
      });
    });
});

router.post("/", authenticateToken, (req, res) => {
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
    let { title } = req.body;
    let slider = new Slider();
    slider.title = title;
    slider.img_link = SLIDER_ROOT + req.file.filename;

    slider
      .save()
      .then((slider) => {
        return res.status(201).json({
          msg: "Slider was created successfully!",
          slider: slider,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          msg: `Can not create slider with error: ${new Error(err.message)}`,
        });
      });
  });
});

router.delete("/", authenticateToken, (req, res) => {
  let { id } = req.body;
  Slider.findOneAndDelete({ _id: id })
    .then((slider) => {
      try {
        fs.unlinkSync("./public" + slider.img_link);
        return res.status(200).json({
          msg: "Delete slider successfully!",
        });
      } catch (err) {
        return res.status(200).json({
          msg: "Delete slider successfully!",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        msg: `Can not delete this slider. Error: ${new Error(err.message)}`,
      });
    });
});


router.post('/drop-collection', authenticateToken, (req, res) => {
  try {
    Slider.collection.drop()
    return res.status(200).json({
      msg: `Drop Slider collection successfully!`
    })
  } catch (error) {
    return res.status(500).json({
      msg: `Can not drop Slider collection ${new Error(err.message)}`
    })
  }
})

module.exports = router;
