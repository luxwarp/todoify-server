const categoriesModel = require('../models/categories-model')

module.exports = {
  getById: (req, res, next) => {
    categoriesModel.find({ _id: req.params.categoryId, userId: req.body.userId }, (err, categoryData) => {
      if (err) {
        next(err)
      } else {
        if (categoryData.length <= 0) {
          res.status(400).json({ status: 'error', message: 'Could not find a category matching id and user.' })
        } else {
          res.json({ status: 'success', message: 'Found category.', data: categoryData })
        }
      }
    })
  },
  getAll: (req, res, next) => {
    categoriesModel.find({ userId: req.body.userId }, (err, categories) => {
      if (err) {
        next(err)
      } else {
        if (categories.length <= 0) {
          res.status(400).json({ status: 'error', message: 'No categories found for this user.' })
        } else {
          res.status(200).json({ status: 'success', message: 'Found categories.', data: categories })
        }
      }
    })
  },
  deleteById: (req, res, next) => {
    categoriesModel.findOneAndDelete({ _id: req.params.categoryId, userId: req.body.userId }, (err, categoryData) => {
      if (err) {
        next(err)
      } else {
        if (!categoryData) {
          res.status(400).json({ status: 'error', message: 'No category with this id and user could be deleted.' })
        } else {
          res.status(200).json({ status: 'success', message: 'Category deleted' })
        }
      }
    })
  },
  create: (req, res, next) => {
    categoriesModel.create({ title: req.body.title, userId: req.body.userId }, (err, result) => {
      if (err) {
        next(err)
      } else {
        if (!result) {
          res.status(500).json({ status: 'error', message: 'Something went wrong creating the category.' })
        } else {
          res.status(202).json({ status: 'success', message: 'Category created.', data: result })
        }
      }
    })
  }
}
