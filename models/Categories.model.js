const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
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

categorySchema.pre('save', function (next) {
  this.increment()
  return next()
})

module.exports = mongoose.model('Category', categorySchema)
