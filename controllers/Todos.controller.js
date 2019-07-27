const Todos = require("../models/Todos.model");
const createError = require("http-errors");

module.exports = {
  getById: async (req, res, next) => {
    try {
      const todo = await Todos.findOne({
        _id: req.params.todoId,
        userId: req.body.userId
      }).populate(req.query.populate || "");
      if (!todo) throw createError(404, "Could not find to-do.");

      res.status(200).json({
        message: "Found to-do.",
        data: todo
      });
    } catch (error) {
      return next(error);
    }
  },
  getAll: async (req, res, next) => {
    try {
      const todos = await Todos.find({ userId: req.body.userId })
        .populate(req.query.populate || "")
        .sort(req.query.sort || "-createdAt");

      res.status(200).json({
        message: `Found following to-do's.`,
        data: todos
      });
    } catch (error) {
      return next(error);
    }
  },
  updateById: async (req, res, next) => {
    try {
      const todo = await Todos.findOne({
        _id: req.params.todoId,
        userId: req.body.userId
      });
      if (!todo) throw createError(404, "Could not find to-do to update.");

      if ("title" in req.body) todo.title = req.body.title;
      if ("done" in req.body) todo.done = req.body.done;
      if ("category" in req.body) {
        todo.category = req.body.category;
      }

      const newTodo = await todo.save();
      await newTodo.populate(req.query.populate || "").execPopulate();

      res.status(200).json({
        message: "To-do updated.",
        data: newTodo
      });
    } catch (error) {
      return next(error);
    }
  },
  deleteById: async (req, res, next) => {
    try {
      const deleted = await Todos.findOneAndDelete({
        _id: req.params.todoId,
        userId: req.body.userId
      });
      if (!deleted) throw createError(404, "No to-do found to delete.");

      res.status(204).json({
        message: "To-do deleted."
      });
    } catch (error) {
      return next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const todo = new Todos({
        _id: req.body._id,
        title: req.body.title,
        userId: req.body.userId,
        category: req.body.category
      });

      const newTodo = await todo.save();
      await newTodo.populate(req.query.populate || "").execPopulate();

      res.status(201).json({
        message: "To-do created.",
        data: newTodo
      });
    } catch (error) {
      return next(error);
    }
  }
};
