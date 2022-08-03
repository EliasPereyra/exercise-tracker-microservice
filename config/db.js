require('dotenv').config()
const mongoose = require('mongoose')

const mongo_uri = process.env.DB_URI

module.exports = function () {
  mongoose.connect(mongo_uri, {

  })

  mongoose.connection.on('error', () => console.error("Error: Failed connection to DB"))
  mongoose.connection.on('connected', () => console.log("DB connected"))
}
