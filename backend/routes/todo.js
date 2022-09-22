const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.js');

// todo path
router.get('/', todoController.cache, todoController.get);
router.post('/', todoController.add);
router.delete('/', todoController.delete);
router.put('/', todoController.update);
  
module.exports = router