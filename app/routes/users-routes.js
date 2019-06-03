const routes = require('express').Router()
const userController = require('../controllers/users-controller')

routes.post('/register', userController.create)
routes.post('/authenticate', userController.authenticate)

module.exports = routes
