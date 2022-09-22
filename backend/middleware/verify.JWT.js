const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN,
    (err, decoded) => {
      if (err) return res.sendStatus(403); // invalid token
      console.log(decoded);
      req.user = decoded.email;
      next();
    }
  )
}

