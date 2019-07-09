const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const Users = require('../models/Users.model')

module.exports = async (req, res, next) => {
  try {
    if (!req.headers['authorization']) {
      throw createError(401, 'Missing authorization header.')
    }
    let token = req.headers['authorization']
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length)
    }
    const decoded = await jwt.verify(token, req.app.get('secretKey'), (error, decoded) => {
      if (error) throw createError(401, 'Could not verify token, pass it in header as authorization')
      return decoded
    })
    req.body.userId = decoded.id
    const user = await Users.findById(req.body.userId, '+authenticated')
    if (user.authenticated) {
      return next()
    } else {
      throw createError(401, 'Not authorized.')
    }
  } catch (error) {
    return next(error)
  }
}
