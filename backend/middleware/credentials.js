const allowOrigins = require('../config/allowOrigins');

const credentials = (req, res, next) => {
  const orgin = req.headers.origin;
  if (allowOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
}

module.exports = credentials