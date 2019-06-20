const Todos = require('../models/Todos.model')

module.exports = {
  getById: (req, res, next) => {
    Todos.findOne({ _id: req.params.todoId, userId: req.body.userId })
      .populate('category')
      .catch(error => next(error))
      .orFail(next({
        status: 404,
        message: 'Could not find any to-do matching id and user.',
        clientMessage: 'Could not find to-do.'
      }))
      .then(result => {
        res.status(200).json({
          message: 'Found to-do.',
          clientMessage: 'Found to-do.',
          data: result
        })
      })
  },
  getAll: (req, res, next) => {
    Todos.find({ userId: req.body.userId })
      .populate('category')
      .catch(error => next(error))
      .orFail(next({
        status: 404,
        message: `Could not find any to-do's.`,
        clientMessage: `Could not find to-do's.`
      }))
      .then(result => {
        res.status(200).json({
          message: `Found to-do's.`,
          clientMessage: `Found to-do's.`,
          data: result
        })
      })
  },
  deleteById: (req, res, next) => {
    Todos.findOneAndDelete({ _id: req.params.todoId, userId: req.body.userId })
      .catch(error => next(error))
      .orFail(next({
        status: 404,
        message: 'No to-do with this id and user could be deleted.',
        clientMessage: 'Could not find any to-do to delete.'
      }))
      .then(result => {
        res.status(204).json({
          message: 'To-do deleted.',
          clientMessage: 'To-do deleted.'
        })
      })
  },
  create: (req, res, next) => {
    Todos.create({
      title: req.body.title,
      userId: req.body.userId,
      category: req.body.category
    })
      .catch(error => next({
        status: 400,
        message: error.message,
        clientMessage: error.message
      }))
      .then(result => {
        res.status(201).json({
          message: 'To-do created.',
          clientMessage: 'To-do created.',
          data: result
        })
      })
  }
}
