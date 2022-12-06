const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const layout = require("express-ejs-layouts");

app.set("view engine", "ejs"); //set view engine cho nodejs
app.set("views", "./FE/views"); //set thư mục view cho project
app.use(express.static("./public")); //set đường dẫn tới thư mục public gồm css,js,bootstrap...



//get data from form Express v4.16.0 and higher
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));



mongoose.connect(
    process.env.mongoose,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    () => {
      console.log("connect database successfully");
    },
    (error) => console.log(error.message)
  );
  
app.use(layout); //set layout


//controllers
const account = require('./BE/controllers/account_controller');
const homeController = require('./BE/controllers/home_controller');
const messageController = require('./BE/controllers/message-controller');
const postController = require('./BE/controllers/post_controller');
const pricingController = require('./BE/controllers/pricing_controller');
const servicesController = require('./BE/controllers/services_controller');
const trialOrderController = require('./BE/controllers/trial-order-controller');

/** admin controllers */
const adminAuthController = require('./BE/controllers/admin/auth_controller');
const adminCategoryController = require('./BE/controllers/admin/group_controller');
const adminConfigController = require('./BE/controllers/admin/config_controller');
const adminFAQController = require('./BE/controllers/admin/faq_controller');
const adminHomeController = require('./BE/controllers/admin/home_controller');
const adminGroupController = require('./BE/controllers/admin/group_controller');
const adminPostController = require('./BE/controllers/admin/post_controller');
const adminServicePackController = require('./BE/controllers/admin/pricing_controller');
const adminSliderController = require('./BE/controllers/admin/slider_controller');
const adminSubGroupController = require('./BE/controllers/admin/sub_group_controller');
const adminTrialOrderController = require('./BE/controllers/admin/trial_order_controller');


app.use('/',homeController);
app.use('/',account);
app.use('/admin/auth',adminAuthController);
app.use('/message',messageController);
app.use('/post',postController);
app.use('/pricing',pricingController);
app.use('/services',servicesController);
app.use('/trial-order',trialOrderController);



//using admin controllers
app.use('/admin/category',adminCategoryController);
app.use('/admin/config',adminConfigController);
app.use('/admin',adminHomeController);
app.use('/admin/faq',adminFAQController);
app.use('/admin/group',adminGroupController);
app.use('/admin/home',adminHomeController);
app.use('/admin/post',adminPostController);
app.use('/admin/pricing',adminServicePackController);
app.use('/admin/slider',adminSliderController);
app.use('/admin/sub-group',adminSubGroupController);
app.use('/admin/trial-order',adminTrialOrderController);


app.listen(process.env.PORT, (_) => {
  console.log(`server is running on port ${process.env.PORT}`);
});
  