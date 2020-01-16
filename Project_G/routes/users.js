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
/**
 * @name get/login
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/login', (req, res) => {
  console.log('Get login page')
  res.render('login', { session: req.session, message: '' })
})

/**
 * Route to login
 * @name post/login
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {string} username - username of the user
 * @param {string} password - the password of the user
 * @param {callback} middleware - Express middleware.
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
    // res.status(404).render('404', { session: req.session }) // .send('You are not registered ! Your username or password might be wrong !')
    res.render('login', { session: req.session, message: 'You are not registered ! Your username or password might be wrong !' })
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
 * @name get/logout
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
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
 * @name get/register
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/register', (req, res) => {
  console.log('Get register page')
  res.render('register', { session: req.session })
})

/**
 * Route to create a new account
 * @name post/register
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @param {string} firstname - firstename of the user
 * @param {string} lastname - lastname of the user
 * @param {string} username - username of the user
 * @param {string} mail - mail of the user
 * @param {string} password - password of the user
 * @param {string} street -street of the user
 * @param {string} city - city of the user
 * @param {number} postalCode - postal code of the user
 * @param {string} country - country of the user
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
 * @name get/updateInformation
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
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
 * @name post/updateInformation
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @param {string} mail - new mail
 * @param {string} street - new street
 * @param {string} city - new city
 * @param {number} postalCode - new postal code
 * @param {string} country - new country
 */
router.post('/updateInformation', async (req, res) => {
  const { mail, birthday, street, city, postalCode, country } = req.body
  try {
    await User.findOneAndUpdate({ username: req.session.username }, { mail: mail, birthday: birthday, address: { street: street, city: city, postalCode: postalCode, country: country } })
    res.redirect('/')
    return
  } catch (err) {
    res.status(404).send(err)
  }
})

/**
 * Route to get page to change password
 * @name get/updatePassword
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/updatePassword', async (req, res) => {
  console.log('Update password: ' + req.session.username)
  res.render('updatePassword', { session: req.session })
})

/**
 * Route to update user's password
 * @name get/login
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {string} oldPassword - the old password of the user
 * @param {string} newPassword - the new password
 * @param {string} verifiedPassword - the verification of the new password
 * @param {callback} middleware - Express middleware.
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
      // res.render('index', { session: req.session })
      res.redirect('/')
      return
    } catch (err) {
      res.status(404).send(err)
    }
  }
})

/**
 * Route to get the user's information page
 * @name get/userInfo
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
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
 * @name get/orders
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
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
