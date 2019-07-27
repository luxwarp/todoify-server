const Categories = require("../models/Categories.model");
const Todos = require("../models/Todos.model");
const createError = require("http-errors");

module.exports = {
  getById: async (req, res, next) => {
    try {
      const category = await Categories.findOne({
        _id: req.params.categoryId,
        userId: req.body.userId
      });
      if (!category) throw createError(404, "Could not find category");
      res.status(200).json({
        message: "Found category.",
        data: category
      });
    } catch (error) {
      return next(error);
    }
  },
  getAll: async (req, res, next) => {
    try {
      const categories = await Categories.find({
        userId: req.body.userId
      }).sort(req.query.sort || "title");

      res.status(200).json({
        message: "Found following categories",
        data: categories
      });
    } catch (error) {
      return next(error);
    }
  },
  updateById: async (req, res, next) => {
    try {
      const category = await Categories.findOne({
        _id: req.params.categoryId,
        userId: req.body.userId
      });
      if (!category) {
        throw createError(404, "Could not find category to update.");
      }

      if ("title" in req.body) category.title = req.body.title;

      const newCategory = await category.save();

      res.status(200).json({
        message: "Category updated.",
        data: newCategory
      });
    } catch (error) {
      return next(error);
    }
  },
  deleteById: async (req, res, next) => {
    try {
      const category = await Categories.findOneAndDelete({
        _id: req.params.categoryId,
        userId: req.body.userId
      });
      if (!category) {
        throw createError(404, "Could not find category to delete.");
      }
      await Todos.updateMany(
        { category: req.params.categoryId, userId: req.body.userId },
        { category: null }
      );

      res.status(204).json({
        message: "Category deleted."
      });
    } catch (error) {
      return next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const category = new Categories({
        _id: req.body._id,
        title: req.body.title,
        userId: req.body.userId
      });

      console.log(category._id);

      const newCategory = await category.save();

      res.status(201).json({
        message: "Category created.",
        data: newCategory
      });
    } catch (error) {
      return next(error);
    }
  }
};
