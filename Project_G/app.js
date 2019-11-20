const express = require('express')
const session = require('express-session')
const users = require('./routes/users.js')
const articles = require('./routes/articles.js')
var app = express()
const path = require('path')
// coucou
const bodyParser = require('body-parser') // pour parser les requêtes POST
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/theHotGnome')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false })) // for simple form posts
app.use(bodyParser.json()) // for API requests

// app.use(favicon(path.join(__dirname, 'views', 'Images', 'icon.ico'))) // Not working

app.use(session({
  secret: 'mydirtylittlesecret',
  name: 'sessId'
}))

app.use('/users', users.router)
app.use('/articles', articles.router)

app.use(express.static('views'))

app.get('/', (req, res) => {
  console.log('OK')
  res.render('index')
  // res.send('ok')
})

app.listen(3000, () => {
  console.log('Application démarrée sur le port 3000!')
})
