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

router.use(tokenToUserMiddleware)
/** ** route for log ** **/
router.get('/login', (req, res) => {
  console.log('Get login page')
  res.render('login', { session: req.session })
})

/**
 * Route to login
 * @param in username, username of the user
 * @param in password, the password of the user
 */
router.post('/login', async (req, res) => {
  console.log(req.body)
  const { username, password } = req.body

  const user = await User.findOne({ username: username })
  if (!user) {
    res.render('404', { session: req.session })
    return
  }
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(404).render('404', { session: req.session }) // .send('You are not registered ! Your username or password might be wrong !')
    return
  }

  console.log(user.role)
  const role = user.role
  if (username === '') {
    res.render('404', { session: req.session })
  } else {
    console.log(`Post login page ${username}`)
    req.session.username = username
    req.session.role = role
    req.session.cart = []
    console.log(req.session)
    if (req.session.urlorigin) {
      const path = req.session.urlorigin
      req.session.urlorigin = undefined
      res.redirect(path)
    } else {
      res.redirect('/')
    }
    // res.render('index', { session: req.session })
  }
})

/**
 * Route to logout
 * Destroy the current session and redirect to index page
 */
router.get('/logout', (req, res) => {
  req.session.destroy()
  // res.send('Disconnected!')
  res.redirect('/')
  // res.render('index', { session: req.session })
})

/** ** route for register ** **/
/**
 * Route to get register page
 */
router.get('/register', (req, res) => {
  console.log('Get register page')
  res.render('register', { session: req.session })
})

/**
 * Route to create a new account
 * @param in firstname of the user
 * @param in lastname of the user
 * @param in username of the user
 * @param in mail of the user
 * @param in password of the user
 * @param in street of the user
 * @param in city of the user
 * @param in postalCode of the user
 * @param in country of the user
 */
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
      },
      role: undefined,
      orders: []
    })
    await newUser.save()
    console.log(newUser)
    // res.render('index', { session: req.session })
    res.redirect('/')
    // res.send('User registered!')
    console.log(`Post register page ${username}`)
    req.session.username = newUser.username
    return
  } catch (err) {
    res.status(404).render('404', { session: req.session })
  }
})

/** route for update **/
/**
 * Route to get user information update page
 */
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

/**
 * Route to update user's information
 * @param in mail, new mail
 * @param in street, new street
 * @param in city, new city
 * @param in postalCode, new postal code
 * @param in country, new country
 */
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

/**
 * Route to get page to change password
 */
router.get('/updatePassword', async (req, res) => {
  console.log('Update password: ' + req.session.username)
  res.render('updatePassword', { session: req.session })
})

/**
 * Route to update user's password
 * @param in oldPassword, the old password of the user
 * @param in newPassword, the new password
 * @param in verifiedPassword, the verification of the new password
 */
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
      //res.render('index', { session: req.session })
      res.redirect('/')
      return
    } catch (err) {
      res.status(404).send(err)
    }
  }
})

/**
 * Route to get the user's information page
 */
router.get('/userInfo', async (req, res) => {
  if (!req.session.username || req.session.username === '') {
    res.redirect('login')
  } else {
    console.log(`Consulting user's info of: ${req.session.username}`)
    const user = await User.findOne({ username: req.session.username })
    const result = {
      username: user.username,
      birthDate: user.birthDate,
      mail: user.mail,
      address: user.address
    }
    // res.send(result)
    res.render('userInfo', { session: req.session, user: result })
  // res.render('500', { session: req.session })
  }
})

/**
 * Route to obtain the page resuming the orders of the user
 */
router.get('/orders', async (req, res) => {
  if (!req.session.username || req.session.username === '') {
    res.redirect('login')
  } else {
    console.log(`Consulting orders of: ${req.session.username}`)
    const user = await User.findOne({ username: req.session.username })
    const orders = user.orders
    // res.send(result)
    res.render('orders', { session: req.session, orders: orders })
  // res.render('500', { session: req.session })
  }
})

module.exports = {
  router
}
