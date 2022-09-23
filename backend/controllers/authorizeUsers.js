const userModel = require('../models/user');
const bcrypt = require ('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const authorizeUsers = {
  getUsers: (req, res) => {
    const {email} = req.body
    userModel.get(email, (err, result) => {
      if (err) return res.status(500).json({"error": err});
      if (result.length > 0) {
        const data = []
        result.map(user => {
          data.push({
            id: user.user_id,
            name: user.user_name,
            email: user.email,
            enroll_at: user.EnrollAt
          })
        })
        
        res.status(200).json(data);
      }
      else {
        res.status(401).json({"message": "User does not exist"});
      }
    })
  },
  getUser: (req, res) => {
    const {email} = req.body;
    userModel.get(email, (err, result) => {
      if (err) return res.status(500).json({"error": err});
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
        res.status(401).json({"message": "User does not exist"});
      }
    })
  },
  createNewUser: (req, res) => {
    const saltRounds = 10;
    const {username, email, password} = req.body;
    // need to do input check for sql injection
    if (!username || !email || !password) {
      return res.status(500).json('username, email and password are required!');
    }
    if (password) {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          return res.status(500).json(`hash error: ${err}`);
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
        userModel.add(data, res);
        res.sendStatus(200);
      })
    }
  },
  deleteUser: (req, res) => {
    const {user_id} = req.body;
    userModel.delete(user_id, (err, result) => {
      if (err) return res.status(500).json({"error": err});
    })
    return res.sendStatus(200);
  },
  updateUser: (req, res) => {
    const data = req.body;
    userModel.updateAuth(data, (err, result) => {
      if (err) return res.status(500).json({"error": err});
      res.sendStatus(200);
    })
  },
  
}

module.exports = authorizeUsers;