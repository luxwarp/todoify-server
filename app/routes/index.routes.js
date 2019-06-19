const routes = require('express').Router()
const users = require('./users.routes')
const categories = require('./categories.routes')
const todos = require('./todos.routes')
const validateUser = require('../helpers/userValidation')

routes.get('/', (req, res) => {
  res.json(200, { status: 'success', message: 'Welcome!', clientMessage: 'Welcome' })
})

routes.use('/users', users)
routes.use('/categories', validateUser, categories)
routes.use('/todos', validateUser, todos)

module.exports = routes
