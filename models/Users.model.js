const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: true,
    select: false
  },
  name: {
    type: String,
    trim: true,
    required: false,
    default: null
  }
},
{
  timestamps: true
})

UserSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10)
  next()
})

module.exports = mongoose.model('User', UserSchema)
