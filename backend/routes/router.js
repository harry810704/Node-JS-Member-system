const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.js');
const userController = require('../controllers/user.js');

// middleware to test if authenticated

router.post('/register', userController.register);
router.post('/login', userController.login);

router.post('/member', userController.update);
router.get('/logout', userController.logout);

// backend path
router.get('/todo', todoController.cache, todoController.get);
router.post('/add', todoController.add);
router.post('/del', todoController.delete);
router.post('/edit', todoController.update);

module.exports = router