const db = require('../db/mysql');

const userModel = {
  get: (email, cb) => {
    let query_string = `SELECT * FROM users`;
    if (email) query_string = `SELECT * FROM users WHERE email = '${email}'`;
    db.query(query_string, (err, result) => {
      if (cb) {
        if (err) cb(err);
        cb(null, result)
      } else {
        if (err) throw err;
        return result;
      }
    })
  },
  get_token: (token, cb) => {
    const query_string = `SELECT * FROM users WHERE refreshToken = '${token}'`;
    db.query(query_string, (err, result) => {
      if (cb) {
        if (err) cb(err);
        cb(null, result)
      } else {
        if (err) throw err;
        return result;
      }
    })
  },
  add: (data, cb) => {
    const username = data.username;
    const email = data.email;
    const pwd = data.password;
    const roles = data.roles;
    let query_string = `SELECT * FROM users WHERE email = '${email}'`;
    db.query(query_string, (err, result) => {
      if (err) cb(err);
      if (result.length > 0) cb(null, `Looks like you already have an account(${email})`);
      else {
        query_string = `INSERT INTO users (user_name, email, pwd, roles) VALUES ('${username}', '${email}', '${pwd}', '${JSON.stringify(roles)}')`;
        db.query(query_string, (err, res) => {
          if (err) cb(err);
          cb(null, res);
        })
      }
    })
  },
  update_token: (data) => {
    const token = data.refreshToken;
    const id = data.id;
    let query_string = `UPDATE users SET refreshToken = '${token}' WHERE user_id = ${id}`;
    db.query(query_string, (err, res) => {
      if (err) {
        console.log(err);
        return(err);
      }
      console.log(res);
      return(null, res);
    })
  },
  update: (data, cb) => {
    const email = data.email;
    const pwd = data.password;
    let query_string = `SELECT * FROM users WHERE email = '${email}'`;
    db.query(query_string, (err, result) => {
      if (err) cb(err);
      if (result.length == 0) cb(null, `Account(${email}) does not exist`);
      else {
        const id = result.user_id;
        query_string = `UPDATE users SET pwd = '${pwd}' WHERE user_id = ${id}`;
        db.query(query_string, (err, res) => {
          if (err) cb(err);
          cb(null, res);
        })
      }
    })
  },
  updateAuth: (data, cb) => {
    const email = data.email;
    const roles = data.roles;
    let query_string = `SELECT * FROM users WHERE email = '${email}'`;
    db.query(query_string, (err, result) => {
      if (err) cb(err);
      if (result.length == 0) cb(null, `Account(${email}) does not exist`);
      else {
        const id = result[0].user_id;
        query_string = `UPDATE users SET roles = '${JSON.stringify(roles)}' WHERE user_id = ${id}`;
        db.query(query_string, (err, res) => {
          if (err) cb(err);
          cb(null, res);
        })
      }
    })
  },
  delete: (id, cb) => {
    const query_string = `DELETE FROM users WHERE user_id = ${id}`;
    db.query(query_string, (err, result) => {
      if (err) cb(err);
      cb(null, result);
    })
  },
}

module.exports = userModel;