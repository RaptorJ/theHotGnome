const express = require('express')
const bcrypt = require('bcryptjs')
var router = express.Router()

const User = require('../models/user.model.js')
const Role = require('../models/role.model.js')

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
  res.render('login', { session: req.session, error: undefined })
})

router.post('/login', async (req, res) => {
  console.log(req.body)
  const { username, password } = req.body

  const user = await User.findOne({ username: username })
  if (!user) {
    res.render('404', { session: req.session })
    return
  }
  console.log(user._role)
  const role = await Role.findById(user._role)
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(404).render('404', { session: req.session }) // .send('You are not registered ! Your username or password might be wrong !')
    return
  }

  if (username === '') {
    res.render('404', { session: req.session })
  } else {
    console.log(`Post login page ${username}`)
    req.session.username = username
    req.session.role = role.name
    console.log(req.session)
    res.render('index', { session: req.session })
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  // res.send('Disconnected!')
  res.render('index', { session: req.session })
})

/** ** route for register ** **/
router.get('/register', (req, res) => {
  console.log('Get register page')
  res.render('register', { session: req.session })
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
    res.render('index', { session: req.session })
    // res.send('User registered!')
    console.log(`Post register page ${username}`)
    req.session.username = newUser.username
    return
  } catch (err) {
    res.status(404).render('404', { session: req.session })
  }
})

/** route for update **/
router.get('/updateInformation', async (req, res) => {
  console.log('Update information: ' + req.session.username)
  const user = await User.findOne({ username: req.session.username })
  const result = {
    username: user.username,
    birthDate: user.birthDate,
    mail: user.mail,
    address: user.address
  }
  res.render('updateInformation', { session: req.session, user: result })
})

router.post('/updateInformation', async (req, res) => {
  const { mail, birthday, street, city, postalCode, country } = req.body
  try {
    await User.findOneAndUpdate({ username: req.session.username }, { mail: mail, birthday: birthday, address: { street: street, city: city, postalCode: postalCode, country: country } })
    res.render('index', { session: req.session })
    return
  } catch (err) {
    res.status(404).send(err)
  }
})

router.get('/updatePassword', async (req, res) => {
  console.log('Update password: ' + req.session.username)
  res.render('updatePassword', { session: req.session })
})

router.post('/updatePassword', async (req, res) => {
  const { oldPassword, newPassword, verifiedPassword } = req.body
  const user = await User.findOne({ username: req.session.username })
  if (!(await bcrypt.compare(oldPassword, user.password))) {
    res.send('Your old password is not correct!')
  } else {
    if (newPassword !== verifiedPassword) {
      res.send('Your new password and your verification password don`t match!')
    }
    try {
      const hashedPassword = await bcrypt.hash(newPassword.toString(), 10)
      await User.findOneAndUpdate({ username: req.session.username }, { password: hashedPassword })
      res.render('index', { session: req.session })
      return
    } catch (err) {
      res.status(404).send(err)
    }
  }
})

router.get('/userInfo', async (req, res) => {
  console.log(`Consulting user's info of: ${req.query.username}`)
  const user = await User.findOne({ username: req.query.username })
  const result = {
    username: user.username,
    birthDate: user.birthDate,
    mail: user.mail,
    address: user.address
  }
  // res.send(result)
  res.render('userInfo', { session: req.session, user: result })
  // res.render('500', { session: req.session })
})

module.exports = {
  router,
  tokenToUserMiddleware
}
