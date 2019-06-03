const todosModel = require('../models/todos-model')

module.exports = {
  getById: (req, res, next) => {
    todosModel.find({ _id: req.params.todoId, userId: req.body.userId }, (err, todoData) => {
      if (err) {
        next(err)
      } else {
        if (todoData.length <= 0) {
          res.status(400).json({ status: 'error', message: 'Could not find a to-do matching id and user.' })
        } else {
          res.json({ status: 'success', message: 'Found to-do.', data: todoData })
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
          res.status(400).json({ status: 'error', message: 'No to-dos found for this user.' })
        } else {
          res.status(200).json({ status: 'success', message: 'Found to-do.', data: todos })
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
          res.status(400).json({ status: 'error', message: 'No to-do with this id and user could be deleted.' })
        } else {
          res.status(200).json({ status: 'success', message: 'To-do deleted' })
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
          res.status(500).json({ status: 'error', message: 'Something went wrong creating the to-do.' })
        } else {
          res.status(202).json({ status: 'success', message: 'To-do created.', data: result })
        }
      }
    })
  }
}
