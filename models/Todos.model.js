const mongoose = require('mongoose')

const todosSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    done: {
      type: Boolean,
      required: false,
      default: false
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      trim: true,
      ref: 'Category',
      default: null
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

todosSchema.pre('save', function (next) {
  this.increment()
  return next()
})

module.exports = mongoose.model('Todo', todosSchema)
