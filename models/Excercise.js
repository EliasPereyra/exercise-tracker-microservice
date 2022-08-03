const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Exercise = new Schema({
  _id: String,

})

const ExerciseSchema = mongoose.model('Exercise', Exercise)

module.exports = ExerciseSchema 
