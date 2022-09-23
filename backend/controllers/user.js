const userModel = require('../models/user');
const bcrypt = require ('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const userController = {
  get: (req, res) => {
    const {email} = req.body;
    userModel.get(email, (err, result) => {
      if (err) console.log(err);
      if (result.length > 0) {
        const data = []
        result.map(user => {
          data.push({
            id: user.user_id,
            name: user.user_name,
            email: user.email,
            roles: Object.values(JSON.parse(user.roles)),
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
  register: (req, res) => {
    const saltRounds = 10;
    const {username, email, password} = req.body;
    // need to do input check for sql injection
    if (!username || !email || !password) {
      console.log('username, email and password is required!');
      return res.status(500).json({'error': 'username, email and password is required!'});
    }
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        return res.status(500).json({'error': `hash error: ${err}`});
      }
      const data = {
        username: username,
        email: email,
        password: hash,
        roles: {
          User: 2001
        }
      }
      userModel.add(data, (err, result) => {
        if (err) return res.status(500).json({'error': err});
        res.sendStatus(200);
      });
    })
  },
  delete: (req, res) => {
    const {user_id} = req.body;
    userModel.delete(user_id, (err, result) => {
      if (err) return res.status(500).json({"error": err});
      res.status(204).json({'message': 'Account has been deleted'});
    })
  },
  update: (req, res) => {
    const saltRounds = 10;
    const {email, password} = req.body;
    if (!email || !password) return res.status(500).json({"error": "email and password is required"});
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        return res.status(500).json({"error": `hash error: ${err}`});
      }
      const data = {
        email: email,
        password: hash,
      }
      userModel.update(data, (err, result) => {
        if (err) return res.status(500).json({"error": err});
      })
      res.sendStatus(200);
    })
  },
  login: (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
      res.status(400).json({ 'error': 'User email and password is required field' });
    }
    userModel.get(email, (err, data) => {
      if (err) return res.status(500).json({"error": err});
      if (data.length > 0){
        console.log(data);
        const roles = Object.values(data[0].roles);
        bcrypt.compare(password, data[0].pwd, (err, isSame) => {
          if (err || !isSame) {
            return res.status(500).json({"error": `Login error: ${err}, ${isSame}`});
          } else {
            const accessToken = jwt.sign(
              { 
                "userInfo": {
                  "email": data[0].email,
                  "roles": roles
                }
              },
              process.env.ACCESS_TOKEN,
              { expiresIn: process.env.ACCESS_EXPIRED_TIME }
            )
            const refreshToken = jwt.sign(
              { "email": data[0].email },
              process.env.REFRESH_TOKEN,
              { expiresIn: process.env.REFRESH_EXPIRED_TIME }
            )
            userModel.update_token({
              id: data[0].user_id,
              refreshToken: refreshToken
            })
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
            res.status(200).json({ accessToken })
          }
        })
      } else {
        res.sendStatus(404).json({'message': 'User does not exist!'});
      }
    })
  },
  logout: (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204); // no content
    const refreshToken = cookies.jwt;

    userModel.get_token(refreshToken, (err, data) => {
      if (err) return res.status(500).json({"error": err});
      if (data.length == 0) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204);
      }
      // delete refresh token in db
      const update_data = {
        id: data[0].user_id,
        refreshToken: null
      }
      userModel.update_token(update_data, (err, d) => {
        if (err) return res.status(500).json({"error": err});
      })
    })
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.status(204).json({'message': 'Logout succeed'});
  }
}

module.exports = userController;