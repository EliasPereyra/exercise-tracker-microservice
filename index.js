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

  const isNumber = Number(limit)
  UserSchema.findById(_id).limit(isNumber).exec((err, user) => {
    if (err) return res.json('Error!')

    if (user) {
      const { username, log } = user

      let responseLog = [...log]

      if (from) {
        const fromDate = new Date(from)
        responseLog = responseLog.filter(exercise => exercise.date > fromDate)
      }

      if (to) {
        const toDate = new Date(to)
        responseLog = responseLog.filter(exercise => exercise.date < toDate)
      }

      responseLog
        .sort((Exercise1, Exercise2) => Exercise1.date > Exercise2.date)
        .map(exercise => ({
          description: exercise.description,
          duration: exercise.duration,
          date: exercise.date.toDateString()
        }))

      const { length: count } = responseLog

      res.json({
        username: username, count: count, log: responseLog
      })
    } else {
      res.json('Unknown user')
    }
  })
})

app.post('/api/users/:_id/exercises', (req, res) => {
  const { id, description, duration, date } = req.body;
  const newdate = new Date(date)

  const log = {
    description,
    duration,
    date
  }

  UserSchema.findByIdAndUpdate(id, { $push: { log: log } }, { new: true }, (err, user) => {
    if (err) return res.json("User doesn't exist")

    if (user) {
      const { username } = user
      res.json({ _id: id, username: username, description: description, duration: duration, date: newdate.toString() })
    } else {
      res.json("Unkown id")
    }
  })
})

const listener = app.listen(process.env.PORT || 3010, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
