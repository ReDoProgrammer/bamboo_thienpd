const router = require("express").Router();
const Account = require("../models/account_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get("/init", (req, res) => {
  Account.countDocuments(async (err, count) => {
    if (err) {
      return res.status(500).json({
        msg: "count exists accounts failed",
        error: new Error(err.message),
      });
    }
    if (count > 0) {
      return res.status(409).json({
        msg: "root account has been already initialized!",
      });
    }
    const hashedPassword = await bcrypt.hash("admin", 10);
    var root = await new Account({
      username: "admin",
      password: hashedPassword,
      fullname: "Administrator",
    });
    root
      .save()
      .then((admin) => {
        return res.status(201).json({
          msg: "Initialize root account successfully!",
          root: admin,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          msg: `Can not initialize root account.`,
          error: `${new Error(err)}`,
        });
      });
  });
});

router.get("/login", (req, res) => {
  res.render("account/login", {
    layout: "layouts/fe_layout",
  });
});

router.post("/login", (req, res) => {
  const username = req.body.username;

  Account.findOne({ username: username })
    .then((user) => {
      if(user == null){
        return res.status(401).json({
          msg:'Username is not exist!'
        });
      }

      bcrypt.compare(req.body.password, user.password, function (err, usr) {
        if (err) {
          return res.status(500).json({
            msg: "Login failed!",
            error: new Error(err),
          });
        }
        if (usr) {
          const access_token = jwt.sign(
            user._id.toString(),
            process.env.ACCESS_TOKEN_SECRET
          );
          return res.status(200).json({
            msg: "Login successfully!",
            access_token: access_token,
          });
        } else {
          return res.status(401).json({
            msg: 'Account not exist!',
            message: "passwords do not match",
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
