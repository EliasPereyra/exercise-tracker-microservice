const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ExerciseSchema = new Schema({
  desc: String,
  duration: Number,
  date: { type: Date, default: Date.now() },
})

const User = new Schema({
  username: String,
  count: Number,
  logs: [ExerciseSchema]
})

const UserSchema = mongoose.model('User', User)

module.exports = UserSchema
