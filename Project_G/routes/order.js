const express = require('express')
var router = express.Router()
const Article = require('../models/article.model')
const Order = require('../models/order.model.js')
router.use(express.static('views'))

router.get('/new', (req, res) => {
  // Verify that user is admin -> todo
  console.log('Get new article page')
  res.render('newArticle')
})

// Buy all the article in the cart & generating the order
router.post('/buyArticles', async (req, res) => {
  for (let i = 0; i < req.session.cart.length; i++) {
    if (req.session.cart[i].number === 0) {
      req.session.cart.splice(i, 1)
      console.log('"' + req.session.cart[i].title + '" is out of stock')
      res.status(410).send('cart')
      return
    }
  }
  let price = 0
  await asyncForEach(req.session.cart, async element => {
    price += element.price
    await Article.findOneAndUpdate({ id: element.id }, { number: element.number-- })
  })
  const order = new Order({
    username: req.session.username,
    articles: req.session.cart,
    price: price
  })
  await order.save()
  req.session.cart = []
  res.send('index')
}
)

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
