const express = require('express')
const app = express()
const cors = require('cors')
require('./config/db')()
require('dotenv').config()

const UserSchema = require('./model/User')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', async (req, res) => {
  const users = await UserSchema.find({})

  res.json(users)
})

app.post('/api/users', (req, res) => {
  const { username } = req.body

  UserSchema.create({ username: username }, (err, user) => {
    if (err) return console.error(err)

    return res.json({
      username: username,
      _id: user.id
    })
  })

})

app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params
  const { limit, from, to } = req.query

  const convertedToNumber = Number(limit)

  UserSchema.findById(_id, function (err, user) {
    if (err) return res.json('Error!')

    if (user) {
      const { username, log } = user
      let responseLog = [...log]

      if (from) {
        const fromFormatted = new Date(from)
        responseLog = responseLog.filter(exercise => exercise.date > fromFormatted);
      }

      if (to) {
        const toFormatted = new Date(to);
        responseLog = responseLog.filter(exercise => exercise.date < toFormatted)
      }

      responseLog = log
        .sort((firstExercise, secondExercise) => firstExercise.date > secondExercise.date)
        .map(exercise => ({
          description: exercise.description,
          duration: exercise.duration,
          date: exercise.date?.toDateString()
        }))

      const { length: count } = responseLog

      if (convertedToNumber) {
        responseLog = responseLog.slice(0, convertedToNumber)
      }

      res.json({
        _id: _id, username: username, count: convertedToNumber || count, log: responseLog
      })
    } else {
      res.json('Unknown user')
    }
  })
})

app.post('/api/users/:_id/exercises', (req, res) => {
  const { id, description, duration, date } = req.body;
  let newDate
  if (!date) {
    newDate = new Date()
  }
  newDate = new Date(date)

  const log = {
    description,
    duration,
    date
  }

  UserSchema.findByIdAndUpdate(id, { $push: { log: log } }, { new: true }, (err, user) => {
    if (err) return res.json("User doesn't exist")

    if (user) {
      const { username } = user
      res.json({ username: username, date: newDate.toDateString(), duration: duration, description: description })
    } else {
      res.json("Unkown id")
    }
  })
})

const listener = app.listen(process.env.PORT || 3010, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
