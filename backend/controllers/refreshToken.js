const userModel = require('../models/user');
const bcrypt = require ('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const handleRefreshtoken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  userModel.get_token(refreshToken, (err, data) => {
    if (err) return res.status(403).json(err);
    if (data.length > 0) {
      const rToken = data[0].refreshToken;
      jwt.verify(
        rToken,
        process.env.REFRESH_TOKEN,
        (err, decoded) => {
          if (err || !(data[0].email == decoded.email) ) return res.sendStatus(403);
          const accessToken = jwt.sign(
            {"username": decoded.email},
            process.env.ACCESS_TOKEN,
            {expiresIn: process.env.ACCESS_EXPIRED_TIME}
          )
          res.json({ accessToken });
        }
      )
    }
  })
}

module.exports = { handleRefreshtoken }