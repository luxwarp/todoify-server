const Categories = require('../models/Categories.model')

module.exports = {
  getById: (req, res, next) => {
    Categories.findOne({ _id: req.params.categoryId, userId: req.body.userId }, (err, categoryData) => {
      if (err) {
        next(err)
      } else {
        if (categoryData.length <= 0) {
          res.status(404).json({
            status: 'info',
            message: 'Could not find a category matching id and user.',
            clientMessage: 'Could not find category.'
          })
        } else {
          res.status(200).json({
            status: 'success',
            message: 'Found category.',
            clientMessage: 'Found category.',
            data: categoryData
          })
        }
      }
    })
  },
  getAll: (req, res, next) => {
    Categories.find({ userId: req.body.userId }, (err, categories) => {
      if (err) {
        next(err)
      } else {
        if (categories.length <= 0) {
          res.status(404).json({
            status: 'info',
            message: 'No categories found for this user.',
            clientMessage: 'Could not find any categories.'
          })
        } else {
          res.status(200).json({
            status: 'success',
            message: 'Found categories.',
            clientMessage: 'Found categories',
            data: categories
          })
        }
      }
    })
  },
  deleteById: (req, res, next) => {
    Categories.findOneAndDelete({ _id: req.params.categoryId, userId: req.body.userId }, (err, categoryData) => {
      if (err) {
        next(err)
      } else {
        if (!categoryData) {
          res.status(404).json({
            status: 'error',
            message: 'No category with this id and user could be deleted.',
            clientMessage: 'Could not find category to delete.'
          })
        } else {
          res.status(204).json({
            status: 'success',
            message: 'Category deleted.',
            clientMessage: 'Category deleted.'
          })
        }
      }
    })
  },
  create: (req, res, next) => {
    Categories.create({ title: req.body.title, userId: req.body.userId }, (err, result) => {
      if (err) {
        next(err)
      } else {
        if (!result) {
          res.status(500).json({
            status: 'error',
            message: 'Something went wrong creating the category.',
            clientMessage: 'Could not create category.'
          })
        } else {
          res.status(201).json({
            status: 'success',
            message: 'Category created.',
            clientMessage: 'Category created.',
            data: result
          })
        }
      }
    })
  }
}
