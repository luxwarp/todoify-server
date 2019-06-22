const routes = require('express').Router()
const Users = require('../controllers/Users.controller')
const validateUser = require('../middlewares/userValidation')

// public routes
routes.post('/register', Users.create)
routes.post('/authenticate', Users.authenticate)

// protected routes
routes.get('/', validateUser, Users.getUser)

module.exports = routes
