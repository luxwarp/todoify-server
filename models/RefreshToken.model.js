const mongoose = require('mongoose')

const RefreshTokenSchema = new mongoose.Schema({
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
})

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema)
