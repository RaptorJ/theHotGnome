const fs = require('fs')
// const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('./models/user.model.js')
const Article = require('./models/article.model.js')
const Role = require('./models/role.model.js')
const Cart = require('./models/cart.model.js')
mongoose.connect('mongodb://localhost/theHotGnome')

fs.readFile('./data.json', 'utf8', (err, jsonString) => {
  if (err) {
    console.log('Error reading file from disk:', err)
  }
  try {
    const data = JSON.parse(jsonString)
    // console.log('Data to push in database: ', data)
    pushRoles(data)
    pushUsers(data)
    pushArticles(data)
    pushCarts(data)
  } catch (err) {
    console.log('Error parsing JSON string', err)
  }
})

function pushRoles (data) {
  data.roles.forEach(async (role) => {
    try {
      const newRole = new Role({
        name: role.name
      })
      await newRole.save()
      console.log('Role ' + role.name + ' registered')
    } catch (err) {
      console.log('Error while registering user: ', err)
    }
  })
}

function pushUsers (data) {
  data.users.forEach(async (user) => {
    try {
      let userRole
      if (user._role === 'admin') userRole = await Role.findOne({ name: 'admin' })
      else if (user._role === 'premium') userRole = await Role.findOne({ name: 'premium' })
      else if (user._role === 'user') userRole = await Role.findOne({ name: 'user' })
      else userRole = {}
      // const hashedPassword = await bcrypt.hash(user.password.toString(), 8)
      const newUser = new User({
        username: user.username,
        password: user.password,
        mail: user.mail,
        birthDate: user.birthDate,
        _role: userRole,
        address: user.address
      })
      await newUser.save()
      console.log('User ' + user.username + ' registered')
    } catch (err) {
      console.log('Error while registering user: ', err)
    }
  })
}

function pushArticles (data) {
  data.articles.forEach(async (article) => {
    try {
      const newArticle = new Article({
        seller: article.seller,
        title: article.title,
        content: article.content,
        date: article.date,
        price: article.price,
        comments: article.comments
      })
      await newArticle.save()
      console.log('Article ' + article.title + ' registered')
    } catch (err) {
      console.log('Error while registering user: ', err)
    }
  })
}

function pushCarts (data) {
  data.carts.forEach(async (cart) => {
    try {
      const cartUser = User.findOne({ username: cart._user })
      cart.articles.forEach((article) => {
        const cartArticles = []
        cartArticles.push(Article.findOne({ title: article.title }))
      })
      const newCart = new Cart({
        _user: cartUser,
        articles: cartArticles
      })
      await newCart.save()
      console.log('Cart with ' + cart.articles.stringify() + ' registered')
    } catch (err) {
      console.log('Error while registering user: ', err)
    }
  })
}
