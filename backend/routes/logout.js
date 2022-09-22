const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js');


// middleware to test if authenticated
router.get('/', userController.logout);

module.exports = router