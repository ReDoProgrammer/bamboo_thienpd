const router = require('express').Router();
const Group = require('../models/group_model');
const SubGroup = require('../models/sub_group_model');
const Post = require('../models/post_model');
router.get('/', (req, res) => {
  let { sgId } = req.query;
  Post
    .find({ sub_group: sgId })
    .sort({
      created_date: -1
    })
    .exec()
    .then(posts => {
      SubGroup.findById(sgId, (err, sg) => {
        if (err) {
          return res.status(500).json({
            msg: `${new Error(err.message)}`
          })
        }
        if (!sg) {
          return res.status(404).json({
            msg: `Subgroup not found`
          })
        }
        return res.status(200).json({
          msg: `Load posts list successfully!`,
          posts: posts,
          sg: sg
        })
      })

    })
    .catch(err => {
      return res.status(500).json({
        msg: `Can not load posts list. ${new Error(err.message)}`,
        error: `${new Error(err.message)}`
      })
    })
})


router.get('/list-6latest-posts', async (req, res) => {


  const posts = await Group.aggregate([
    {
      $lookup: {
        from: "sub_groups",
        localField: "_id",
        foreignField: "group",
        as: "sub_groups"
      }
    },
    {
      $unwind: "$sub_groups"
    },
    {
      $lookup: {
        from: "posts",
        let: { subGroupId: "$sub_groups._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$sub_group", "$$subGroupId"]
              }
            }
          },
          {
            $sort: {
              "created_date": -1
            }
          },
          {
            $limit: 5
          }
        ],
        as: "sub_groups.posts"
      }
    },
    {
      $sort: {
        "_id": 1,
        "sub_groups.name": 1
      }
    },
    {
      $group: {
        _id: {
          group: "$name",
          sub_group: "$sub_groups.name"
        },
        posts: {
          $push: "$sub_groups.posts"
        },
        type: { $first: "$type" }
      }
    },
    {
      $project: {
        _id: 0,
        group: "$_id.group",
        sub_group: "$_id.sub_group",
        type: 1,
        posts: {
          $reduce: {
            input: "$posts",
            initialValue: [],
            in: {
              $concatArrays: ["$$value", "$$this"]
            }
          }
        }
      }
    }
  ]);
  





  return res.status(200).json({
    posts
  })
})

module.exports = router;