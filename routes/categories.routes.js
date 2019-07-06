const routes = require('express').Router()
const Categories = require('../controllers/Categories.controller')

routes.get('/', Categories.getAll)
routes.get('/:categoryId', Categories.getById)
routes.post('/', Categories.create)
routes.patch('/:categoryId', Categories.updateById)
routes.delete('/:categoryId', Categories.deleteById)

module.exports = routes
