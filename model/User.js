const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
  username: String,
  log: [{
    description: String,
    duration: Number,
    date: Date
  }]
})

const UserSchema = mongoose.model('User', User)

module.exports = UserSchema
