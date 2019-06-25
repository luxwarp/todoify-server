const routes = require('express').Router()
const createError = require('http-errors')
const users = require('./users.routes')
const categories = require('./categories.routes')
const todos = require('./todos.routes')
const validateUser = require('../middlewares/userValidation')

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome!' })
})

routes.use('/users', users)
routes.use('/categories', validateUser, categories)
routes.use('/todos', validateUser, todos)

// 404 routes if no other route matches request this error will be sent to error handler.
routes.use((req, res, next) => {
  next(createError(404, `Path: ${req.path} not found`))
})

module.exports = routes
