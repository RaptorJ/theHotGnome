const fs = require('fs')
// const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('./models/user.model.js')
const Article = require('./models/article.model.js')
mongoose.connect('mongodb://localhost/theHotGnome')

fs.readFile('./data.json', 'utf8', (err, jsonString) => {
  if (err) {
    console.log('Error reading file from disk:', err)
  }
  try {
    const data = JSON.parse(jsonString)
    console.log('Data to push in database: ', data)
    pushUsers(data)
    pushArticles(data)
    console.log('All done!')
    process.exit()
  } catch (err) {
    console.log('Error parsing JSON string', err)
  }
})

function pushUsers (data) {
  data.users.forEach(async (user) => {
    try {
      // const hashedPassword = await bcrypt.hash(user.password.toString(), 8)
      const newUser = new User({
        username: user.username,
        password: user.password
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
