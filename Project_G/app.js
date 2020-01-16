const express = require('express')
const session = require('express-session')
const users = require('./routes/users.js')
const articles = require('./routes/articles.js')
var app = express()
const path = require('path')
const bodyParser = require('body-parser') // pour parser les requêtes POST
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://admin:admin@cluster0-fyqyq.azure.mongodb.net/theHotGnome')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false })) // for simple form posts
app.use(bodyParser.json()) // for API requests

app.use(session({
  name: 'sessId',
  username: undefined,
  role: undefined,
  cart: undefined,
  urlorigin: undefined,
  secret: 'myDirtyLittleSecret'
}))

app.use('/users', users.router)
app.use('/articles', articles.router)

app.use(express.static('views'))

app.get('/', async (req, res) => {
  console.log('OK')
  const items = await articles.getLatestItems()
  res.render('index', { session: req.session, items: items })
})

app.get('/500', (req, res) => {
  console.log('En développement')
  res.render('500', { session: req.session })
})

app.listen(3000, () => {
  console.log('Application démarrée sur le port 3000!')
})
