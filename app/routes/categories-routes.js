const routes = require('express').Router()
const categoriesController = require('../controllers/categories-controller')

routes.get('/', categoriesController.getAll)
routes.get('/:categoryId', categoriesController.getById)
routes.post('/', categoriesController.create)
routes.delete('/:categoryId', categoriesController.deleteById)

module.exports = routes
