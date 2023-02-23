const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const POST_IMAGE_ROOT = '/images/upload/posts/';
const sharp = require('sharp');
const fs = require('fs');
require("dotenv").config();


const SINGLE_STORAGE = "/images/upload/posts/";
//config upload from two input files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/upload/posts')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + `_${file.originalname}`)
  }
})

var storage_single = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/upload/posts");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage })
const uploadMultiple = upload.fields([{ name: 'img_before', maxCount: 1 }, { name: 'img_after', maxCount: 1 }]);
const upload_single = multer({ storage: storage_single }).single("img_Single");



const { authenticateToken } = require("../../middlewares/authenticate");
const Post = require("../../models/post_model");

router.get("/", (req, res) => {
  res.render("admin/post/index", {
    name: "Post",
    layout: "layouts/admin_layout",
  });
});

router.get("/list", authenticateToken, (req, res) => {
  let { page, search, subGroupId } = req.query;
  let limit = process.env.PAGE_SIZE;

  Post.find({
    $or: [
      { caption: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ],
    sub_group: subGroupId
  })
    .skip((page - 1) * parseInt(limit))
    .limit(parseInt(limit))
    .populate("sub_group", "name")
    .exec((err, posts) => {
      if (err) {
        console.log(`load posts list failed with error: ${new Error(err.message)}`);
        return res.status(500).json({
          msg: `load posts list failed with error: ${new Error(err.message)}`,
          error: err.message,
        });
      }
      return res.status(200).json({
        msg: "Load posts list successfully!",
        posts: posts,
      });
    });

});

router.get("/detail", authenticateToken, (req, res) => {
  Post.findById(req.query.postId)
    .populate('sub_group', 'name -_id')
    .exec()
    .then(post => {
      if (post == null) {
        return res.status(404).json({
          msg: 'Post not found'
        });
      }
      return res.status(200).json({
        msg: 'Get post detail successfully!',
        post: post
      });
    })
    .catch(err => {
      return res.status(500).json({
        msg: new Error(err.message)
      });
    });
});

router.post('/video',authenticateToken, async (req,res)=>{
  let {sub_group,caption,description,video_url} = req.body;
  let p = new Post({caption,description,sub_group,video_url});
  await p.save()
  .then(_=>{
    return res.status(201).json({
      msg:`The post has been created!`
    })
  })
  .catch(err=>{
    return res.status(500).json({
      msg:`Can not create new post with error: ${new Error(err.message)}`
    })
  })
})

router.post('/single', authenticateToken, async (req, res) => {
  upload_single(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({
        msg: `Upload post image failed with error: ${err.message}`,
        error: err.message,
      });
    }
    if (err) {
      res.status(500).json({
        msg: `Can not upload post image with error:${err.message}`,
        error: err.message
      });
    }

    let imgURL = SINGLE_STORAGE + req.file.filename;
    fs.copyFile.value = imgURL;
    let { sub_group, caption, description } = req.body;
    console.log(sub_group, caption, description, req.file.filename);
    let p = new Post();
    p.img_url = imgURL;
    p.caption = caption;
    p.description = description;
    p.sub_group = sub_group;

    await p.save()
    .then(_=>{
      return res.status(201).json({
        msg:`The post has been created!`
      })
    })
    .catch(err=>{
      return res.status(500).json({
        msg:`Can not create new post with error: ${new Error(err.message)}`
      })
    })


  });
})

router.post("/comparison", authenticateToken, (req, res) => {
  uploadMultiple(req, res, async (err) => {
    if (err) {
      console.log(`upload post from two input files failed with error ${new Error(err.message)}`);
      return res.status(500).json({
        msg: `${new Error(err.message)}`
      });
    }

    //reduce image before & image after to thumbnail
    Promise.all([
      ReduceImageSize(req.files.img_before[0]),
      ReduceImageSize(req.files.img_after[0])
    ])
      .then(fileNames => {
        let { sub_group, caption, description } = req.body;
        let post = new Post({
          sub_group,
          caption,
          description,
          img_before: POST_IMAGE_ROOT + `${req.files.img_before[0].filename}`,
          img_after: POST_IMAGE_ROOT + `${req.files.img_after[0].filename}`,
          img_before_thumbnail: POST_IMAGE_ROOT + `thumbnail/${fileNames[0]}`,
          img_after_thumbnail: POST_IMAGE_ROOT + `thumbnail/${fileNames[1]}`
        });
        post.save()
          .then(post => {
            return res.status(201).json({
              msg: 'Create a new post successfully!',
              post: post
            });
          })
          .catch(err => {
            console.log(`Create a new post failed with error: ${new Error(err.message)}`);
            return res.status(500).json({
              msg: `Create a new post failed with error: ${new Error(err.message)}`
            });

          });
      })
      .catch(err => {
        console.log(`${new Error(err.message)}`);
      })
  });
});



router.put("/", authenticateToken, (req, res) => {
  let { id, name, description } = req.body;
  if (name.trim().length == 0) {
    return res.status(403).json({
      msg: "Group name can not be blank!",
    });
  }
  Group.findOneAndUpdate(
    { _id: id },
    {
      name,
      description,
    },
    {
      new: true,
    },
    (err, group) => {
      if (err) {
        return res.status(500).json({
          msg: "Update group failed!",
          error: new Error(err),
        });
      }
      if (!group) {
        return res.status(404).json({
          msg: "Group not found!",
        });
      }
      return res.status(200).json({
        msg: "Update group successfully!",
        group: group,
      });
    }
  );
});

router.delete("/", authenticateToken, async(req, res) => {
  let id = req.body.id;
  let p = await Post.findById(id);
  if(!p){
    return res.status(404).json({
      msg:`Post not found!`
    })
  }
  await p.delete()
  .then(_=>{
    return res.status(200).json({
      msg:`The post has been deleted!`
    })
  })
  .catch(err=>{
    return res.status(500).json({
      msg:`Can not delete this post with error: ${new Error(err.message)}`
    })
  })
});


router.post('/drop-collection', authenticateToken, (req, res) => {
  try {
    Post.collection.drop()
    return res.status(200).json({
      msg: `Drop Post collection successfully!`
    })
  } catch (error) {
    return res.status(500).json({
      msg: `Can not drop Post collection ${new Error(err.message)}`
    })
  }
})


const ReduceImageSize = (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      let fileName = "thumbnail_" + new Date().getTime() + file.originalname;
      fs.access("./public/images/upload/posts/thumbnail", (err) => {
        if (err) {
          fs.mkdirSync("./public/images/upload/posts/thumbnail");
        }
      });
      await sharp(file.path)
        .resize({
          width: 300,
          height: 188,
        })
        .toFile(
          "./public/images/upload/posts/thumbnail/" + fileName
        );
      return resolve(fileName);
    } catch (err) {
      return reject(new Error(err.message));
    }
  })
}

module.exports = router;
