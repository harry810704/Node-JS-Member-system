const userModel = require('../models/user');
const bcrypt = require ('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const authorizeUsers = {
  getAllUsers: (req, res) => {
    userModel.get(null, (err, result) => {
      if (err) console.log(err);
      if (result.length > 0) {
        const data = []
        result.map(user => {
          data.append({
            id: user.user_id,
            name: user.user_name,
            email: user.email,
            enroll_at: user.EnrollAt
          })
        })
        
        res.status(200).json(data);
      }
      else {
        console.log(`User does not exist`);
        res.sendStatus(401);
      }
    })
  },
  getUser: (req, res) => {
    const {email} = req.query;
    userModel.get(email, (err, result) => {
      if (err) console.log(err);
      if (result.length > 0) {
        const data = {
          id: result[0].user_id,
          name: result[0].user_name,
          email: result[0].email,
          enroll_at: result[0].EnrollAt
        }
        res.status(200).json(data);
      }
      else {
        console.log(`User does not exist`);
        res.sendStatus(401);
      }
    })
  },
  createNewUser: (req, res) => {
    const saltRounds = 10;
    const {username, email, password} = req.body;
    // need to do input check for sql injection
    if (!email) {
      console.log('email is required!');
      res.status(500).send('email is required!');
    }
    if (password) {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          console.log(`hash error: ${err}`);
          res.status(500).send(`hash error: ${err}`);
        }
        const data = {
          username: username,
          email: email,
          password: hash,
          roles: {
            User: 2001
          },
          refreshToken: refreshToken,
        }
        userController.add(data, res);
        res.sendStatus(200);
      })
    }
  },
  deleteUser: (req, res) => {
    const user_id = req.query.user_id;
    userModel.delete(user_id, (err, result) => {
      if (err) console.log(err);
      if (result.deleteId) console.log(`User is deleted! ID: ${result.deleteId}`);
      else console.log(result)
    })
  },
  updateUser: (req, res) => {
    const data = req.body;
    userModel.updateAuth(data, (err, result) => {
      if (err) console.log(err);
      res.sendStatus(200);
    })
  },
  
}

module.exports = authorizeUsers;