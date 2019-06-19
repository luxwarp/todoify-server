const Todos = require('../models/Todos.model')

module.exports = {
  getById: (req, res, next) => {
    Todos.findOne({ _id: req.params.todoId, userId: req.body.userId })
      .populate('category')
      .exec((error, result) => {
        if (error) next(error)

        if (result.length <= 0) {
          res.status(404).json({
            status: 'info',
            message: 'Could not find any to-do matching id and user.',
            clientMessage: 'Could not find to-do.'
          })
        } else {
          res.status(200).json({
            status: 'success',
            message: 'Found to-do.',
            clientMessage: 'Found to-do.',
            data: result
          })
        }
      })
  },
  getAll: (req, res, next) => {
    Todos.find({ userId: req.body.userId })
      .populate('category')
      .exec((error, result) => {
        if (error) next(error)

        if (result.length <= 0) {
          res.status(404).json({
            status: 'info',
            message: `Could not find any to-do's.`,
            clientMessage: `Could not find to-do's.`
          })
        } else {
          res.status(200).json({
            status: 'success',
            message: `Found to-do's.`,
            clientMessage: `Found to-do's.`,
            data: result
          })
        }
      })
  },
  deleteById: (req, res, next) => {
    Todos.findOneAndDelete({ _id: req.params.todoId, userId: req.body.userId })
      .exec((error, result) => {
        if (error) next(error)

        if (!result) {
          res.status(404).json({
            status: 'info',
            message: 'No to-do with this id and user could be deleted.',
            clientMessage: 'Could not find any to-do to delete.'
          })
        } else {
          res.status(204).json({
            status: 'success',
            message: 'To-do deleted.',
            clientMessage: 'To-do deleted.'
          })
        }
      })
  },
  create: (req, res, next) => {
    Todos.create({ title: req.body.title, userId: req.body.userId, category: req.body.category }, (error, result) => {
      if (error) next(error)

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
    })
  }
}
