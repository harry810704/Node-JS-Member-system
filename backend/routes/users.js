const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js');

// middleware to test if authenticated
router.get('/', userController.get);
router.put('/', userController.update);
// need to add authentication for deleting an account
router.delete('/', userController.delete);
router.get('/logout', userController.logout);

module.exports = router