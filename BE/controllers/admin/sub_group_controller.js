const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { authenticateToken } = require("../../middlewares/authenticate");
const SubGroup = require("../../models/sub_group_model");
const Group = require("../../models/group_model");
const THUMBNAIL_LOCATION = "/images/upload/sub_groups/thumbnail/";
const BANNER_LOCATION = "/images/upload/sub_groups/banner/";
const MAX_SHOWN = 6;

//config upload from two input files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/upload/sub_groups/banner");
  },
  filename: function (req, file, cb) {
    cb(null, "banner_" + new Date().getTime() + `_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
const uploadMultiple = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);

router.get("/", (req, res) => {
  res.render("admin/subgroup/index", {
    name: "Sub Group",
    layout: "layouts/admin_layout",
  });
});

router.get("/list", authenticateToken, (req, res) => {
  SubGroup.find({})
    .populate("group", "name")
    .then((sgs) => {
      console.log(sgs);
      return res.status(200).json({
        msg: "Load sub groups list successfully!",
        sgs: sgs,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        msg: "Can not load sub groups list",
        error: new Error(err),
      });
    });
});

router.get("/listById", authenticateToken, (req, res) => {
  let { groupId } = req.query;
  SubGroup.find({ group: groupId })
    .then((sgs) => {
      return res.status(200).json({
        msg: "List sub groups by group id successfully",
        sgs: sgs,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        msg: "Can not list sub groups by group id",
        error: new Error(err),
      });
    });
});

router.post("/", authenticateToken, async (req, res) => {
  await uploadMultiple(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        msg: `${new Error(err.message)}`,
      });
    }

    ReduceImageSize(req.files.thumbnail[0])
      .then((fileName) => {
        let { group,type, name, metatitle, description } = req.body;
        let thumbnail = THUMBNAIL_LOCATION + fileName;
        let banner = BANNER_LOCATION + req.files.banner[0].filename;

        let sg = new SubGroup({
          name,
          type,
          metatitle,
          description,
          banner,
          thumbnail,
          group,
        });
        sg.save()
          .then((s) => {
            Group.findByIdAndUpdate(
              group,
              { $push: { subs: s._id } },
              {
                new: true,
              },
              (err, g) => {
                if (err) {
                  return res.status(500).json({
                    msg: `Can not update subgroups list of group ${new Error(
                      err.message
                    )}`,
                  });
                }
                if (!g) {
                  return res.status(404).json({
                    msg: `Can not found group need to update subgroups list`,
                  });
                }

                return res.status(200).json({
                  msg: `Create subgroup successfully`,
                  sg: s,
                });
              }
            );
          })
          .catch((err) => {
            return res.status(500).json({
              msg: `${new Error(err.message)}`,
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          msg: `${new Error(err.message)}`,
        });
      });
  });
});

router.put("/change-shown-state", authenticateToken, (req, res) => {
  let { id } = req.body;

  SubGroup.findById(id)
    .exec()
    .then((sg) => {
      if (!sg) {
        return res.status(404).json({
          msg: `Subgroup not found`,
        });
      }
      if (!sg.is_shown) {
        SubGroup.countDocuments({ is_shown: true }, (err, total) => {
          if (err) {
            return res.status(500).json({
              msg: `Count subgroup failed. ${new Error(err.message)}`,
              error: `${new Error(err.message)}`,
            });
          }
          if (total >= MAX_SHOWN) {
            return res.status(403).json({
              msg: `Can not set more shown subgroup. Maximum is ${MAX_SHOWN} subgroups! ^_^`,
              error: `Maximum of subgroup shown is ${MAX_SHOWN}`,
            });
          } else {
            SubGroup.findOneAndUpdate(
              { _id: id },
              {
                is_shown: !sg.is_shown,
              },
              { new: true },
              (err, subGroup) => {
                if (err) {
                  return res.status(500).json({
                    msg: `Can not update subgroup shown state. ${new Error(
                      err.message
                    )}`,
                    error: Error(err.message),
                  });
                }
                return res.status(200).json({
                  msg: `Update Subgroup state successfully!`,
                  sg: subGroup,
                });
              }
            );
          }
        });
      } else {
        SubGroup.findOneAndUpdate(
          { _id: id },
          {
            is_shown: !sg.is_shown,
          },
          { new: true },
          (err, subGroup) => {
            if (err) {
              return res.status(500).json({
                msg: `Can not update subgroup shown state. ${new Error(
                  err.message
                )}`,
                error: Error(err.message),
              });
            }
            return res.status(200).json({
              msg: `Update Subgroup state successfully!`,
              sg: subGroup,
            });
          }
        );
      }
    })
    .catch((err) => {
      return res.status(500).json({
        msg: `Subgroup not found. ${new Error(err.message)}`,
        error: new Error(err.message),
      });
    });
});

router.delete("/", authenticateToken, (req, res) => {
  let id = req.body.id;
  SubGroup.findOneAndDelete({ _id: id }, (err, sg) => {
    if (err) {
      return res.status(500).json({
        msg: "Can not delete this sub group!",
        error: new Error(err),
      });
    } else {
      if (!sg) {
        return res.status(404).json({
          msg: "Sub group not found",
        });
      } else {
        Group
        .findByIdAndUpdate(
          sg.group,
          { $pull: { subs: sg._id } },
          { new: true },
          (err, sg) => {
            console.log(sg);
          }
        );

        return res.status(200).json({
          msg: "Delete sub group successfully!",
        });
      }
    }
  });
});

router.get("/detail", authenticateToken, (req, res) => {
  let { id } = req.query;
  SubGroup.findById(id, (err, subGroup) => {
    if (err) {
      return res.status(500).json({
        msg: "Can not get sub group detail",
        error: new Error(err),
      });
    }
    if (!subGroup) {
      return res.status(404).json({
        msg: "Sub group not found",
      });
    }
    return res.status(200).json({
      msg: "Get sub group detail successfully",
      sg: subGroup,
    });
  });
});

router.post("/drop-collection", authenticateToken, (req, res) => {
  try {
    SubGroup.collection.drop();
    return res.status(200).json({
      msg: `Drop subgroup collection successfully!`,
    });
  } catch (error) {
    return res.status(500).json({
      msg: `Can not drop SubGroup collection ${new Error(err.message)}`,
    });
  }
});

const ReduceImageSize = (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      let fileName = "thumbnail_" + new Date().getTime() + file.originalname;
      fs.access("./public/images/upload/sub_groups/thumbnail", (err) => {
        if (err) {
          fs.mkdirSync("./public/images/upload/sub_groups/thumbnail");
        }
      });
      await sharp(file.path)
        .resize({
          width: 300,
          height: 188,
        })
        .toFile("./public/images/upload/sub_groups/thumbnail/" + fileName);
      return resolve(fileName);
    } catch (err) {
      return reject(new Error(err.message));
    }
  });
};

module.exports = router;
