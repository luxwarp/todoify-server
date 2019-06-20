const Categories = require('../models/Categories.model')

module.exports = {
  getById: (req, res, next) => {
    Categories.findOne({ _id: req.params.categoryId, userId: req.body.userId })
      .catch(error => next(error))
      .then(result => {
        if (!result) {
          return next({
            status: 404,
            message: 'Could not find a category matching id and user.',
            clientMessage: 'Could not find category.'
          })
        }
        res.status(200).json({
          message: 'Found category.',
          clientMessage: 'Found category.',
          data: result
        })
      })
  },
  getAll: (req, res, next) => {
    Categories.find({ userId: req.body.userId })
      .catch(error => next(error))
      .then(result => {
        if (result.length <= 0) {
          return next({
            status: 404,
            message: 'No categories for this user found.',
            clientMessage: 'Could not find any categories.'
          })
        }
        res.status(200).json({
          message: 'Found categories.',
          clientMessage: 'Found categories',
          data: result
        })
      })
  },
  deleteById: (req, res, next) => {
    Categories.findOneAndDelete({ _id: req.params.categoryId, userId: req.body.userId })
      .catch(error => next(error))
      .then(result => {
        if (!result) {
          return next({
            status: 404,
            message: 'No category with this id and user could be deleted.',
            clientMessage: 'Could not find category to delete.'
          })
        }
        res.status(204).json({
          message: 'Category deleted.',
          clientMessage: 'Category deleted.'
        })
      })
  },
  create: (req, res, next) => {
    Categories.create({ title: req.body.title, userId: req.body.userId })
      .catch(error => next({
        status: 400,
        message: error.message,
        clientMessage: error.message
      }))
      .then(result => {
        res.status(201).json({
          message: 'Category created.',
          clientMessage: 'Category created.',
          data: result
        })
      })
  }
}
