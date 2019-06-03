const users = require('./users-routes')
const categories = require('./categories-routes')
const todos = require('./todos-routes')
const validateUser = require('../helpers/userValidation')
const routes = require('express').Router()

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello!' })
})

// public routes
routes.use('/users', users)

// private routes
routes.use('/categories', validateUser, categories)
routes.use('/todos', validateUser, todos)

routes.use((req, res, next) => {
  res.status(404).json({ status: 'error', message: 'Sorry, could not find anything here.' })
})

routes.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ status: 'error', message: err.message })
})

module.exports = routes
