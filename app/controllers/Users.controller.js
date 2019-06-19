const Users = require('../models/Users.model')
const brypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
  getUser: (req, res, next) => {
    Users.findById(req.body.userId, (err, userInfo) => {
      if (err) {
        next(err)
      } else {
        if (!userInfo) {
          res.status(404).json({
            status: 'info',
            message: 'No user found matching id.',
            clientMessage: 'Could not find user.'
          })
        } else {
          res.status(200).json({
            status: 'success',
            message: 'Found user.',
            clientMessage: 'Found user.',
            data: userInfo
          })
        }
      }
    })
  },
  create: (req, res, next) => {
    Users.findOne({ email: req.body.email }, (err, existing) => {
      if (err) {
        next(err)
      } else if (existing) {
        res.status(409).json({
          status: 'error',
          message: 'Email is already registered.',
          clientMessage: 'Email is already registered.'
        })
      } else {
        Users.create({
          email: req.body.email,
          password: req.body.password,
          name: req.body.name
        },
        (err) => {
          if (err) {
            next(err)
          } else {
            res.status(201).json({
              status: 'success',
              message: 'User account is created.',
              clientMessage: 'User account is created.'
            })
          }
        })
      }
    })
  },
  authenticate: (req, res, next) => {
    Users.findOne({ email: req.body.email }, (err, userInfo) => {
      if (err) {
        next(err)
      } else {
        if (!userInfo) {
          res.status(400).json({
            status: 'error',
            message: 'Could not authenticate. Check email or password.',
            clientMessage: 'Wrong email or password.'
          })
        } else {
          if (brypt.compare(req.body.password, userInfo.password)) {
            const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), { expiresIn: '1h' })
            res.status(200).json({
              status: 'success',
              message: 'Successfully authenticated.',
              clientMessage: 'Successfully authenticated.',
              data: {
                token: token,
                tokenExpiresIn: '1h'
              }
            })
          } else {
            res.status(400).json({
              status: 'error',
              message: 'Could not authenticate. Check email or password.',
              clientMessage: 'Wrong email or password.'
            })
          }
        }
      }
    })
  }
}
