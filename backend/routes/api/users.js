const express = require('express');
const router = express.Router();
const authorizeUsers = require('../../controllers/authorizeUsers');
const rolesList = require('../../config/rolesList');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(authorizeUsers.getUsers)
    .post(verifyRoles(rolesList.Admin, rolesList.Editor) ,authorizeUsers.createNewUser)
    .put(verifyRoles(rolesList.Admin, rolesList.Editor), authorizeUsers.updateUser)
    .delete(verifyRoles(rolesList.Admin), authorizeUsers.deleteUser)

module.exports = router