const mongoose = require('mongoose')

const RefreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      trim: true,
      required: true
    },
    userId: {
      type: String,
      trim: true,
      required: true
    }
  },
  {
    timestamps: true
  }
)

RefreshTokenSchema.pre('save', function (next) {
  this.increment()
})

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema)
