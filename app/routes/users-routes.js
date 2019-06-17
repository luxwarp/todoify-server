const routes = require('express').Router()
const userController = require('../controllers/users-controller')
const validateUser = require('../helpers/userValidation')

// public routes
routes.post('/register', userController.create)
routes.post('/authenticate', userController.authenticate)

// protected routes
routes.get('/', validateUser, userController.getUserInfo)

module.exports = routes
