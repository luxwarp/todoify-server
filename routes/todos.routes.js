const routes = require('express').Router()
const Todos = require('../controllers/Todos.controller')

routes.get('/', Todos.getAll)
routes.get('/:todoId', Todos.getById)
routes.post('/', Todos.create)
routes.patch('/:todoId', Todos.updateById)
routes.delete('/:todoId', Todos.deleteById)

module.exports = routes
