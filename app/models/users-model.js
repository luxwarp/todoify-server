const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  }
},
{
  timestamps: true
})

UserSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, saltRounds)
  next()
})

module.exports = mongoose.model('User', UserSchema)
