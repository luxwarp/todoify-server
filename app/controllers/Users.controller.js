const Users = require('../models/Users.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
  getUser: (req, res, next) => {
    Users.findById(req.body.userId)
      .catch(error => next(error))
      .then(user => {
        if (!user) {
          return next({
            status: '404',
            message: 'No user found matching id.',
            clientMessage: 'Could not find user.'
          })
        }

        res.status(200).json({
          message: 'Found user.',
          clientMessage: 'Found user.',
          data: user
        })
      })
  },
  create: (req, res, next) => {
    Users.findOne({ email: req.body.email })
      .catch(error => next(error))
      .then(exists => {
        if (exists) {
          return next({
            status: 409,
            message: 'Email is already registered.',
            clientMessage: 'Email is already registered.'
          })
        }

        Users.create({
          email: req.body.email,
          password: req.body.password,
          name: req.body.name
        })
          .catch(error => next({
            status: 400,
            message: error.message,
            clientMessage: error.message
          }))
          .then(result => {
            res.status(201).json({
              message: 'User account is created.',
              clientMessage: 'User account is created.',
              data: result
            })
          })
      })
  },
  authenticate: (req, res, next) => {
    Users.findOne({ email: req.body.email }, '+password')
      .catch(error => next(error))
      .then(user => {
        if (!user) {
          return next({
            status: '400',
            message: 'Could not authenticate. Check email or password.',
            clientMessage: 'Wrong email or password.'
          })
        }

        bcrypt.compare(req.body.password, user.password)
          .catch(error => next(error))
          .then(valid => {
            if (!valid) {
              return next({
                status: 400,
                message: 'Could not authenticate. Check email or password.',
                clientMessage: 'Wrong email or password.'
              })
            }

            const token = jwt.sign({ id: user._id }, req.app.get('secretKey'), { expiresIn: '1h' })
            res.status(200).json({
              message: 'Successfully authenticated.',
              clientMessage: 'Successfully authenticated.',
              data: {
                token: token,
                tokenExpiresIn: '1h'
              }
            })
          })
      })
  }
}
