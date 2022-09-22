const db = require('../db/mysql');

const userModel = {
  get: (user_id, cb) => {
    const query_string = `SELECT * FROM todos WHERE user_id = ${user_id}`;
    db.query(query_string, (err, result) => {
      if (err) cb(err);
      cb(null, result)
    })
  },
  add: (data, cb) => {
    const time = new Date.now();
    const user_id = data.user_id;
    const content = data.content;
    const expire = time + 31556926000;
    const query_string = `INSERT INTO todos (content, expire_date, user_id) VALUES ('${JSON.stringify(content)}', '${expire}', '${user_id}')`;
    db.query(query_string, (err, result) => {
      if (err) cb(err);
      cb(null, result);
    })
  },
  delete: (id, cb) => {
    const query_string = `DELETE FROM todos WHERE id = ${id}`;
    db.query(query_string, (err, result) => {
      if (err) cb(err);
      cb(null, result);
    })

  },
  update: (data, cb) => {
    const id = data.id;
    const content = data.content;
    const query_string = `UPDATE todos SET content = ${content} WHERE id = ${id}`;
    db.query(query_string, (err, result) => {
      if (err) cb(err);
      cb(null, result);
    })
  }
}

module.exports = userModel;