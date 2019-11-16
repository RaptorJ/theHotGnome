const express = require('express')

var router = express.Router()

router.use(express.static('views'))

router.get('/login', (req, res) => {
  console.log('Get login page')
  res.render('login')
})

router.post('/login', (req, res) => {
  console.log(req.body)
  const { username, password } = req.body
  if (username === '') {
    res.render('404')
  } else {
    console.log(`Post login page ${username}`)
    req.session.username = username
    res.render('index')
  }
})

module.exports = {
  router
}
