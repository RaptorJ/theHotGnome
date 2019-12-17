const fs = require('fs')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = require('./models/user.model.js')
const Article = require('./models/article.model.js')
const Order = require('./models/order.model.js')
const Categorie = require('./models/categorie.model')
mongoose.connect('mongodb://localhost/theHotGnome')

fs.readFile('./data.json', 'utf8', async (err, jsonString) => {
  if (err) {
    console.log('Error reading file from disk:', err)
  }
  try {
    const data = JSON.parse(jsonString)
    await pushCategories(data)
    await pushUsers(data)
    await pushArticles(data)
    await pushOrders(data)
    console.log('Done!')
    process.exit(0)
  } catch (err) {
    console.log('Error parsing JSON string', err)
  }
})
async function pushCategories (data) {
  await asyncForEach(data.categories, async (cat) => {
    console.log(cat.name)
    try {
      if (!await Categorie.findOne({ name: cat.name })) {
        const newCat = new Categorie({
          name: cat.name
        })
        await newCat.save()
        console.log('Categorie ' + cat.name + ' registered...')
      } else console.log('Warning: Categorie ' + cat.name + ' already exists!')
    } catch (err) {
      console.log('Error while registering categorie: ', err)
    }
  })
}

async function pushUsers (data) {
  await asyncForEach(data.users, async (user) => {
    try {
      if (!await User.findOne({ username: user.username })) {
        const hashedPassword = await bcrypt.hash(user.password.toString(), 10)
        const newUser = new User({
          username: user.username,
          password: hashedPassword,
          mail: user.mail,
          birthDate: user.birthDate,
          role: user.role,
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
      const articleCat = await Categorie.findOne({ name: article.categorie })
      console.log(article.categorie)
      if (!(existingArticle && existingArticle.seller === article.seller)) {
        const newArticle = new Article({
          seller: article.seller,
          title: article.title,
          content: article.content,
          date: article.date,
          price: article.price,
          image: article.image,
          number: article.number,
          categories: articleCat,
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
          articles: orderArticles,
          price: order.price
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
