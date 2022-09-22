const todoModel = require('../models/todo');
const redis_client = require('../db/myredis');

const todoController = {
  cache: (req, res, next) => {
    const id = req.query.id;
    console.log(`fetching data from cache...`);
    redis_client.get(id).then((cachedTodo) => {
      if (cachedTodo) {
        res.send(JSON.parse(cachedTodo));
      } else {
        console.log('cache is empty');
        next();
      }
    }).catch((err) => {
      if (err) console.log(err);
    });
    console.log('cache end');
  },
  get: (req, res) => {
    const id = req.query.id;
    todoModel.get(id, (err, data) => {
      if (err) console.log(err);
      if (data.length > 0){
        redis_client.setEx(String(id), 3600, JSON.stringify(data));
      }
      res.send(data);
    })
  },
  add: (req, res) => {
    // data = {
    //   user_id: #,
    //   content: ''
    // }
    const data = req.query;
    todoModel.add(data, (err, result) => {
      if (err) console.log(err);
      if (result.insertId) console.log(`Item is added! ID: ${result.insertId}`);
      else console.log(result)
    })
  },
  delete: (req, res) => {
    const id = req.query.id;
    todoModel.delete(id, (err, result) => {
      if (err) console.log(err);
      if (result.deleteId) console.log(`Item is deleted! ID: ${result.deleteId}`);
      else console.log(result)
    })
  },
  update: (req, res) => {
    // data = {
    //   id: #,
    //   content: ''
    // }
    const data = req.query;
    todoModel.update(data, (err, result) => {
      if (err) console.log(err);
      if (result.updateId) console.log(`Content is updated! ID: ${result.updateId}`);
      else console.log(result)
    })
  }
}

module.exports = todoController;