const verifyRoles = (...allowRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    const roles = JSON.parse(req.roles);
    const rolesArray = [...allowRoles];
    console.log(rolesArray);
    console.log(roles);
    const result = Object.values(roles).map(role => rolesArray.includes(role)).find(value => value === true);
    if (!result) return res.sendStatus(401);
    next();
  }
}

module.exports = verifyRoles