const todosModel = require('../models/todos-model')

module.exports = {
  getById: (req, res, next) => {
    todosModel.find({ _id: req.params.todoId, userId: req.body.userId }, (err, todoData) => {
      if (err) {
        next(err)
      } else {
        if (todoData.length <= 0) {
          res.status(404).json({
            status: 'info',
            message: 'Could not find any to-do matching id and user.',
            clientMessage: 'Could not find any to-do.'
          })
        } else {
          res.json({
            status: 'success',
            message: 'Found to-do.',
            clientMessage: 'Found to-do.',
            data: todoData })
        }
      }
    })
  },
  getAll: (req, res, next) => {
    todosModel.find({ userId: req.body.userId }, (err, todos) => {
      if (err) {
        next(err)
      } else {
        if (todos.length <= 0) {
          res.status(404).json({
            status: 'info',
            message: 'Could not find any to-dos found for this user.',
            clientMessage: 'Could not find any to-dos.'
          })
        } else {
          res.status(200).json({
            status: 'success',
            message: 'Found to-do.',
            clientMessage: 'Found to-do.',
            data: todos
          })
        }
      }
    })
  },
  deleteById: (req, res, next) => {
    todosModel.findOneAndDelete({ _id: req.params.todoId, userId: req.body.userId }, (err, todoData) => {
      if (err) {
        next(err)
      } else {
        if (!todoData) {
          res.status(404).json({
            status: 'info',
            message: 'No to-do with this id and user could be deleted.',
            clientMessage: 'Could not find any to-do to delete.'
          })
        } else {
          res.status(200).json({
            status: 'success',
            message: 'To-do deleted.',
            clientMessage: 'To-do deleted.'
          })
        }
      }
    })
  },
  create: (req, res, next) => {
    todosModel.create({ title: req.body.title, userId: req.body.userId, categoryId: req.body.categoryId }, (err, result) => {
      if (err) {
        next(err)
      } else {
        if (!result) {
          res.status(500).json({
            status: 'error',
            message: 'Something went wrong creating the to-do.',
            clientMessage: 'Could not create to-do'
          })
        } else {
          res.status(201).json({
            status: 'success',
            message: 'To-do created.',
            clientMessage: 'To-do created.',
            data: result
          })
        }
      }
    })
  }
}
