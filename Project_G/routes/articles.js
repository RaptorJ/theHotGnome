const express = require('express')
var router = express.Router()

const Article = require('../models/article.model.js')

router.use(express.static('views'))

router.get('/new', (req, res) => {
  // Verify that user is admin -> todo
  console.log('Get new article page')
  res.render('newArticle')
})

router.post('/new', async (req, res) => {
  const { seller, title, content, price, number } = req.body
  if (!(title) || !(seller) || !(content) || !(price) || !(number)) {
    res.status(403).send('You did not put enough information!')
  }
  try {
    const newArticle = new Article({
      seller: seller,
      title: title,
      content: content,
      price: price,
      number: number
    })
    await newArticle.save()
    console.log(newArticle)
    res.render('index')
    // res.send('User registered!')
    console.log(`New article successfully added: ${title}`)
    return
  } catch (err) {
    res.status(404).render('404')
  }
})

module.exports = {
  router
}
