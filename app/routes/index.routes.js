const routes = require('express').Router()
const users = require('./users.routes')
const categories = require('./categories.routes')
const todos = require('./todos.routes')
const validateUser = require('../middlewares/userValidation')

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome!', clientMessage: 'Welcome' })
})

routes.use('/users', users)
routes.use('/categories', validateUser, categories)
routes.use('/todos', validateUser, todos)

// 404 routes if no other route matches request this error will be sent to error handler.
routes.use((req, res, next) => {
  next({
    status: 404,
    message: `Path: ${req.path} not found`,
    clientMessage: 'Not found'
  })
})

module.exports = routes
