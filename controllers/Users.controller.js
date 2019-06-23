const Users = require('../models/Users.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')

module.exports = {
  getUser: async (req, res, next) => {
    try {
      const user = await Users.findById(req.body.userId)
      if (!user) throw createError(404, 'User not found.')

      res.status(200).json({
        message: 'Found user.',
        data: user
      })
    } catch (error) {
      return next(error)
    }
  },
  create: async (req, res, next) => {
    try {
      const emailExist = await Users.findOne({ email: req.body.email }, 'email')
      if (emailExist) throw createError(409, 'Email is already registered.')

      const user = new Users({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
      })

      await user.save()

      res.status(201).json({
        message: 'User account is created.'
      })
    } catch (error) {
      return next(error)
    }
  },
  authenticate: async (req, res, next) => {
    try {
      const user = await Users.findOne({ email: req.body.email }, '+password')
      if (!user) throw createError(400, 'Wrong email or password.')

      const match = await bcrypt.compare(req.body.password, user.password)
      if (!match) throw createError(400, 'Wrong email or password.')

      const token = jwt.sign({ id: user._id }, req.app.get('secretKey'), { expiresIn: req.app.get('tokenExpiresIn') })
      res.status(200).json({
        message: 'Successfully authenticated.',
        data: {
          token: token
        }
      })
    } catch (error) {
      return next(error)
    }
  }
}
