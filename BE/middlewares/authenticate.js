require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.render('account/login', {
    layout: 'account/login'
  });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log('got an error when veryfy account: ', new Error(err.message));

      return res.render('account/login', {
        layout: 'account/login'
      });

    }
    req.user = user;
    next();
  });
}


module.exports = {
  authenticateToken
}