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
  name: 'sessId',
  username: undefined,
  secret: 'myDirtyLittleSecret'
}))

app.use('/users', users.router)
app.use('/articles', articles.router)

app.use(express.static('views'))

app.get('/', (req, res) => {
  console.log('OK')
  res.render('index')
  // res.send('ok')
})

app.get('/500', (req, res) => {
  console.log('En développement')
  res.render('500')
  // res.send('ok')
})

app.get('/products', (req, res) => {
  const availableTags = [
    'Playstation 4 Pro',
    'Switch',
    'Asus Rog',
    'Death Stranding',
    'Dark Souls : Par delà la mort',
    'Cyberpunk 2077',
    'Tokyo Ghoul',
    'Goblin Slayer',
    'Iron Man',
    'Monster Hunter : Iceborn',
    'The Legend of Zelda : Breath of the Wild',
    'The Legend of Zelda : Link\'s Awakening',
    'Super Smash Bros Ultimate',
    'Ace Combat 7 : Skies Unknown',
    'Dark Souls III Design Works',
    'Dark Souls I & II Design Works',
    'Bloodborne Artbook officiel',
    'Dark Souls : de Demon\'s Souls à Sekiro',
    'Zelda : Hyrule Historia',
    'Zelda : Art & Artifacs',
    'Zelda : Encyclopedia',
    'NieR : Automata World Guide',
    'Lady Mechanika'
  ]
  res.send(availableTags)
})

app.listen(3000, () => {
  console.log('Application démarrée sur le port 3000!')
})
