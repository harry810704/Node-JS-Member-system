const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshToken.js');


// middleware to test if authenticated
router.get('/', refreshTokenController.handleRefreshtoken);

module.exports = router