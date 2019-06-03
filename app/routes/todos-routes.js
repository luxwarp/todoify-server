const routes = require('express').Router()
const todosController = require('../controllers/todos-controller')

routes.get('/', todosController.getAll)
routes.get('/:todoId', todosController.getById)
routes.post('/', todosController.create)
routes.delete('/:todoId', todosController.deleteById)

module.exports = routes
