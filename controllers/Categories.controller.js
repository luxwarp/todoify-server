const Categories = require('../models/Categories.model')
const createError = require('http-errors')

module.exports = {
  getById: async (req, res, next) => {
    try {
      const category = await Categories.findOne({ _id: req.params.categoryId, userId: req.body.userId })
      if (!category) throw createError(404, 'Could not find category')
      res.status(200).json({
        message: 'Found category.',
        data: category
      })
    } catch (error) {
      return next(error)
    }
  },
  getAll: async (req, res, next) => {
    try {
      const categories = await Categories.find({ userId: req.body.userId })
      if (!categories.length) throw createError(404, 'Could not find any categories.')

      res.status(200).json({
        message: 'Found categories.',
        data: categories
      })
    } catch (error) {
      return next(error)
    }
  },
  deleteById: async (req, res, next) => {
    try {
      const category = await Categories.findOneAndDelete({ _id: req.params.categoryId, userId: req.body.userId })
      if (!category) throw createError(404, 'Could not find category to delete.')

      res.status(204).json({
        message: 'Category deleted.'
      })
    } catch (error) {
      return next(error)
    }
  },
  create: async (req, res, next) => {
    try {
      const category = new Categories({
        title: req.body.title,
        userId: req.body.userId
      })

      const newCategory = await category.save()

      res.status(201).json({
        message: 'Category created.',
        data: newCategory
      })
    } catch (error) {
      return next(error)
    }
  }
}
