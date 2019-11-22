const fs = require('fs')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = require('./models/user.model.js')
const Article = require('./models/article.model.js')
const Role = require('./models/role.model.js')
const Order = require('./models/order.model.js')
mongoose.connect('mongodb://localhost/theHotGnome')

fs.readFile('./data.json', 'utf8', async (err, jsonString) => {
  if (err) {
    console.log('Error reading file from disk:', err)
  }
  try {
    const data = JSON.parse(jsonString)
    await pushRoles(data)
    await pushUsers(data)
    await pushArticles(data)
    await pushOrders(data)
    console.log('Done!')
    process.exit(0)
  } catch (err) {
    console.log('Error parsing JSON string', err)
  }
})

async function pushRoles (data) {
  await asyncForEach(data.roles, async (role) => {
    try {
      if (!await Role.findOne({ name: role.name })) {
        const newRole = new Role({
          name: role.name
        })
        await newRole.save()
        console.log('Role ' + role.name + ' registered...')
      } else console.log('Warning: Role ' + role.name + ' already exists!')
    } catch (err) {
      console.log('Error while registering role: ', err)
    }
  })
}

async function pushUsers (data) {
  await asyncForEach(data.users, async (user) => {
    try {
      if (!await User.findOne({ username: user.username })) {
        const userRole = await Role.findOne({ name: user._role })
        const hashedPassword = await bcrypt.hash(user.password.toString(), 10)
        const newUser = new User({
          username: user.username,
          password: hashedPassword,
          mail: user.mail,
          birthDate: user.birthDate,
          _role: userRole,
          address: user.address
        })
        await newUser.save()
        console.log('User ' + user.username + ' registered...')
      } else console.log('Warning: User ' + user.username + ' already exists!')
    } catch (err) {
      console.log('Error while registering user: ', err)
    }
  })
}

async function pushArticles (data) {
  await asyncForEach(data.articles, async (article) => {
    try {
      const existingArticle = await Article.findOne({ title: article.title })
      if (!(existingArticle && existingArticle.seller === article.seller)) {
        const newArticle = new Article({
          seller: article.seller,
          title: article.title,
          content: article.content,
          date: article.date,
          price: article.price,
          image: article.image,
          comments: article.comments
        })
        await newArticle.save()
        console.log('Article ' + article.title + ' registered...')
      } else console.log('Warning: Article ' + article.title + ' from seller ' + article.seller + ' already exists!')
    } catch (err) {
      console.log('Error while registering article: ', err)
    }
  })
}

async function pushOrders (data) {
  await asyncForEach(data.orders, async (order) => {
    try {
      const orderUser = await User.findOne({ username: order.username })
      if (orderUser) {
        const orderArticles = []
        await asyncForEach(order.articles, async (article) => {
          orderArticles.push(await Article.findOne({ title: article.title }))
        })
        const newOrder = new Order({
          username: orderUser.username,
          articles: orderArticles
        })
        await newOrder.save()
        console.log('Order for user ' + order.username + ' registered...')
      } else console.log('Error: Username ' + order.username + ' not found for cart!')
    } catch (err) {
      console.log('Error while registering order: ', err)
    }
  })
}

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
