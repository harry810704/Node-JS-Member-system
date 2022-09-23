const jwt = require('jsonwebtoken')
require('dotenv').config();

const verifyRoles = (...allowRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN,
      (err, decoded) => {
        if (err) return res.status(500).json({"error": "Authentication invalid"});
        const roles = decoded.userInfo.roles
        const rolesArray = [...allowRoles];
        const result = roles.map(role => rolesArray.includes(role)).find(value => value === true);
        if (!result) return res.sendStatus(401);
        next();
      }
    )
  }
}

module.exports = verifyRoles