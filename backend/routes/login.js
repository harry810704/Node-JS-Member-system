const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js');

// middleware to test if authenticated
router.post('/', userController.login);

module.exports = router