const express = require('express')
const session = require('express-session')
var app = express()
const path = require('path')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(session({
  secret: 'mydirtylittlesecret',
  name: 'sessId'
}))

app.use(express.static('views'))

app.get('/', (req, res) => {
  console.log('OK')
  res.render('index')
  // res.send('ok')
})

app.listen(3000, () => {
  console.log('Application démarrée sur le port 3000!')
})
