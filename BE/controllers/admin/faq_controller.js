const router = require("express").Router();
const { authenticateToken } = require("../../middlewares/authenticate");
const FAQ = require("../../models/faq_model");

router.get("/", (req, res) => {
  res.render("admin/faq/index", {
    name: "Frequently Question and Answers",
    layout: "layouts/admin_layout",
  });
});

router.get("/list", authenticateToken, (req, res) => {
    let { page, search } = req.query;
    let limit = process.env.PAGE_SIZE;
    FAQ.find({
        $or: [
        { question: { $regex: search, $options: "i" } },
        { answer: { $regex: search, $options: "i" } },
        ],
    })
    .skip((page - 1) * parseInt(limit))
    .limit(parseInt(limit))
    .exec((err, faqs) => {
        if (err) {
        return res.status(500).json({
            msg: `load faq list failed with error: ${new Error(err.message)}`,
            error: err.message,
        });
        }
        return res.status(200).json({
        msg: "Load faq list successfully!",
        faqs: faqs,
        });
    });
});

router.get("/detail", authenticateToken, (req, res) => {
  let { id } = req.query;
  FAQ.findById(id, (err, faq) => {
    if (err) {
      return res.status(500).json({
        msg: `Can not get FAQ detail. Error: ${new Error(err.message)}`,
        error: new Error(err.message),
      });
    }

    if (!faq) {
      return res.status(404).json({
        msg: `FAQ not found!`,
      });
    }

    return res.status(200).json({
      msg: `Get FAQ detail successfully!`,
      faq: faq,
    });
  });
});

router.post("/", authenticateToken, (req, res) => {
  let { question, answer } = req.body;
  let faq = new FAQ({
    question,
    answer,
  });
  faq
    .save()
    .then((f) => {
      return res.status(201).json({
        msg: `Faq has been created successfully`,
        faq: f,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        msg: `Create new faq fail with error: ${new Error(err.message)}`,
        error: new Error(err.message),
      });
    });
});

router.put("/", authenticateToken, (req, res) => {
  let { id, question, answer } = req.body;

  FAQ.findOneAndUpdate(
    { _id: id },
    {
      question,
      answer,
    },
    { new: true },
    (err, faq) => {
      if (err) {
        return res.status(500).json({
          msg: `Update FAQ failed with error: ${new Error(err.message)}`,
          error: new Error(err.message),
        });
      }
      if (!faq) {
        return res.status(404).json({
          msg: `FAQ not match`,
        });
      }
      return res.status(200).json({
        msg: `Update FAQ successfully`,
        faq: faq,
      });
    }
  );
});

router.delete("/", authenticateToken, (req, res) => {
  let { id } = req.body;
  FAQ.findByIdAndDelete(id, (err, faq) => {
    if (err) {
      return res.status(500).json({
        msg: `Delete FAQ failed with error: ${new Error(err.message)}`,
        error: new Error(err.message),
      });
    }
    if (!faq) {
      return res.status(404).json({
        msg: `FAQ not match!`,
      });
    }
    return res.status(200).json({
      msg: `Deleted FAQ successfully!`,
      faq: faq,
    });
  });
});

module.exports = router;
