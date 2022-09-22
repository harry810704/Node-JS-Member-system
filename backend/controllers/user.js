const userModel = require('../models/user');
const bcrypt = require ('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const userController = {
  get: (req, res) => {
    const {email} = req.query.email;
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
  add: (data, res) => {
    // data = {
    //   username: '',
    //   email: '',
    //   password: 'hashpwd'
    // }
    userModel.add(data, (err, result) => {
      if (err) console.log(err);
      if (result.insertId) console.log(`User is added! ID: ${result.insertId}`);
      else console.log(result)
    })
  },
  delete: (req, res) => {
    const user_id = req.query.user_id;
    userModel.delete(user_id, (err, result) => {
      if (err) console.log(err);
      if (result.deleteId) console.log(`User is deleted! ID: ${result.deleteId}`);
      else console.log(result)
    })
  },
  update: (req, res) => {
    // data = {
    //   username: '',
    //   email: '',
    //   password: 'hashpwd'
    // }
    const data = req.query;
    userModel.update(data, (err, result) => {
      if (err) console.log(err);
      if (result.updateId) console.log(`User info is updated! ID: ${result.updateId}`);
      else console.log(result)
    })
  },
  register: (req, res) => {
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
        const accessToken = jwt.sign(
          { "email": data[0].email },
          process.env.ACCESS_TOKEN,
          { expiresIn: process.env.ACCESS_EXPIRED_TIME }
        )
        const refreshToken = jwt.sign(
          { "email": data[0].email },
          process.env.REFRESH_TOKEN,
          { expiresIn: process.env.REFRESH_EXPIRED_TIME }
        )
        const data = {
          username: username,
          email: email,
          password: hash,
          refreshToken: refreshToken,
        }
        userController.add(data, res);
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
        res.status(200).json({ accessToken });
      })
    }
  },
  isAuthenticated (req, res, next) {
    console.log(req.session);
    console.log(req.sessionID);
    if (req.session.isLogin) next()
    else next('/login')
  },
  login: (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
      res.status(400).json({ 'message': 'User email and password is required field' });
    }
    userModel.get(email, (err, data) => {
      if (err) console.log(err);
      if (data.length > 0){
        if (password) {
          bcrypt.compare(password, data[0].pwd, (err, isSame) => {
            if (err || !isSame) {
              res.status(500).json({'message': `Login error: ${err}, ${isSame}`});
              res.send('500');
            } else {
              const accessToken = jwt.sign(
                { "email": data[0].email },
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
              // res.redirect('/todo');
            }
          })
        }
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
      if (err) return res.sendStatus(500);
      if (data.length == 0) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204);
      }
      // delete refresh token in db
      const update_data = {
        id: data[0].user_id,
        refreshToken: ''
      }
      userModel.update_token(update_data, (err, d) => {
        if (err) return res.sendStatus(500);
      })
    })
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
  }
}

module.exports = userController;