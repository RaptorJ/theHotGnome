const express = require('express')
const bcrypt = require('bcryptjs')
var router = express.Router()

const User = require('../models/user.model.js')

router.use(express.static('views'))

async function tokenToUserMiddleware (req, res, next) {
  if (req.session && req.session.userId) {
    req.user = await User.findById(req.session.userId)
  }
  next()
}

/** ** route for log ** **/
router.get('/login', (req, res) => {
  console.log('Get login page')
  res.render('login')
})

router.post('/login', async (req, res) => {
  console.log(req.body)
  const { username, password } = req.body

  const user = await User.findOne({ username: username })
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(404).render('404') // .send('You are not registered ! Your username or password might be wrong !')
    return
  }

  if (username === '') {
    res.render('404')
  } else {
    console.log(`Post login page ${username}`)
    req.session.username = username
    res.render('index')
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.send('Disconnected!')
})

/** ** route for register ** **/
router.get('/register', (req, res) => {
  console.log('Get register page')
  res.render('register')
})

router.post('/register', async (req, res) => {
  console.log(req.body)
  const { firstname, lastname, username, mail, password, birthday, street, city, postalCode, country } = req.body
  console.log(req.body)
  if (!(username) || !(mail) || !(password)) {
    res.status(403).send('You did not put enough information!')
  }
  const hash = await bcrypt.hash(password, 10)

  // We want the username to be unique, not the couple userName/mail
  const user = await User.findOne({ username: username })
  if (user) {
    res.status(403).send('This username is already taken !')
    return
  }

  try {
    const newUser = new User({
      firstname: firstname,
      lastname: lastname,
      username: username,
      mail: mail,
      password: hash,
      birthDate: birthday,
      address: {
        street: street,
        city: city,
        postalCode: postalCode,
        country: country
      }
    })
    await newUser.save()
    console.log(newUser)
    res.render('index')
    // res.send('User registered!')
    console.log(`Post register page ${username}`)
    req.session.username = newUser.username
    return
  } catch (err) {
    res.status(404).render('404')
  }
})

module.exports = {
  router,
  tokenToUserMiddleware
}
