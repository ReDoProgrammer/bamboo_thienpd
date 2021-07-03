const router = require("express").Router();
const TrialOrder = require('../../models/trial_order_model');
const { authenticateToken } = require("../../middlewares/authenticate");

router.get("/", (req, res) => {
    res.render("admin/trial_order/index", {
      name: "Trial orders",
      layout: "layouts/admin_layout",
    });
  });

  router.get('/list',authenticateToken,(req,res)=>{
      let {status,search,page} = req.query;
      console.log({status,search,page});
      TrialOrder
      .find({})
      .exec()
      .then(orders=>{
          let result = orders;
          switch(status){
              case 'read':
                  result = orders.filter(x=>x.process==true);
                  break;
              case 'unread':
                  result = order.filter(x=>x.process == false);
                  break;
          }
          return res.status(200).json({
              msg:`Load trial order successfully!`,
              orders:result
          })
         
      })
      .catch(err=>{
          console.log(err);
      })
  })

  module.exports = router;
  