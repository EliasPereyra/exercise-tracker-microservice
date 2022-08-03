const express = require('express')
const app = express()
const cors = require('cors')
require('./config/db')()
require('dotenv').config()

const UserSchema = require('./models/User')
const ExerciseSchema = require('./models/Excercise')

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

  UserSchema.create({ username: username }, (err) => {
    if (err) return console.error(err)
  })

})

app.get('/api/users/:_id/logs', (req, res) => {
  const user = req.params._id


})

app.post('/api/users/:_id/exercises', (req, res) => {
  const { id, description, duration, date } = req.body;
  UserSchema.findById(id, (err, user) => {
    if (err) return res.json('wrong user')
    const { username } = user;
    ExerciseSchema.create({ _id: id, desc: description, duration: duration, date: date })
    res.json({ _id: id, username: username, description: description, duration: duration, date: date })
  })
})

const listener = app.listen(process.env.PORT || 3010, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
