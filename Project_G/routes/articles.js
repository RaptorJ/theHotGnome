const express = require('express')
var router = express.Router()

const Article = require('../models/article.model')
const User = require('../models/user.model')
const Categorie = require('../models/categorie.model')

let availableTag = []
router.use(express.static('views'))

router.get('/new', async (req, res) => {
  // Verify that user is admin -> todo
  console.log('Get new article page')
  const categories = await Categorie.find({})
  availableTag = []
  await asyncForEach(categories, async (obj) => {
    availableTag.push(obj.name)
  })
  res.render('newArticle', { session: req.session, availableTag: availableTag })
})

// Route to get to the article informations
router.get('/info/:title', async (req, res) => {
  console.log('uptdate article page')
  try {
    const article = await Article.findOne({ title: req.param.title })
    res.render('article', { session: req.session, article: article })
    return
  } catch (err) {
    res.status(403).send(err)
  }
})

// Get all item name
async function getAvailableTags () {
  const articles = await Article.find({})
  availableTag = []
  await asyncForEach(articles, async (obj) => {
    availableTag.push(obj.title)
  })
  // console.log(availableTag)
}

router.get('/getArticle', async (req, res) => {
  const article = await Article.findById(req.query.id)
  console.log('get article ' + article.title)
  res.render('viewArticle2', { session: req.session, article: article })
})

router.post('/getArticleList', async (req, res) => {
  let article = await Article.findOne({ title: req.body.title })
  if (article) {
    res.render('viewArticle2', { session: req.session, article: article })
  } else {
    const availableItemId = []
    const str = req.body.title.toLowerCase()
    await asyncForEach(availableTag, async (obj) => {
      if (obj.toLowerCase().indexOf(str) >= 0) {
        article = await Article.findOne({ title: obj })
        availableItemId.push(article)
      }
    })
    res.render('viewArticleList', { session: req.session, articles: availableItemId })
  }
})

// List of product name for search barS
router.post('/products', async (req, res) => {
  await getAvailableTags()
  res.send(availableTag)
})

// Adding the item to the cart of the user connected
router.get('/addToCart', async (req, res) => {
  const id = req.query.id
  try {
    const article = await Article.findById(id)
    req.session.cart.push(article)
    console.log('Cart: ' + req.session.cart)
    res.redirect('cart')
    // res.render('index', { session: req.session })
    return
  } catch (err) {
    console.log(err)
    res.status(403).send(err)
  }
})

router.get('/cart', (req, res) => {
  res.render('cart', { session: req.session, articles: req.session.cart })
})

// Removing an item form the cart
router.post('/removeFromCart', (req, res) => {
  for (let i = 0; i < req.session.cart.length; i++) {
    if (req.session.cart[i].id === req.query.id) req.session.cart.splice(i, 1)
  }
})

/** ** creating an article ** **/
router.post('/new', async (req, res) => {
  const { seller, title, content, price, number, categorie, image } = req.body
  if (!(title) || !(seller) || !(content) || !(price) || !(number) || !(categorie)) {
    res.status(403).send('You did not put enough information!')
    return
  }
  const article = await Article.findOne({ title: title })
  const cat = await Categorie.findOne({ name: categorie })
  if (article) {
    res.status(403).send('This item already exist.')
    return
  }
  try {
    const newArticle = new Article({
      seller: seller,
      title: title,
      content: content,
      price: price,
      image: image,
      categories: cat,
      number: number
    })
    await newArticle.save()
    getAvailableTags()
    res.render('index', { session: req.session })
    console.log(`New article successfully added: ${title}`)
    return
  } catch (err) {
    res.status(404).render('404', { session: req.session })
  }
})

// Uptade some informations (content or price) using the title (primary key)
router.post('/update', async (req, res) => {
  const { title, content, price } = req.body
  try {
    await Article.findOneAndUpdate({ title: title }, { content: content, price: price })
  } catch (err) {
    res.status(404).send(err)
    return
  }
  const article = await Article.findOne({ title: title })
  res.render('article', { article: article })
})

// Delete an item from database
router.post('/deleteItem', async (req, res) => {
  const { id } = req.body
  try {
    await Article.deleteOne({ id: id })
    getAvailableTags()
    res.render('index')
    return
  } catch (err) {
    res.status(403).send(err)
  }
})

router.get('/productsType', async (req, res) => {
  const type = req.query.type
  console.log(type)
  if (!type) {
    res.render('404', { session: req.session })
    return
  }
  const categorieId = await Categorie.findOne({ name: type })
  console.log(categorieId)
  const articles = await Article.find({ categories: categorieId })
  console.log('articles: ' + articles)
  // res.send(articles)
  res.render('viewArticleList', { session: req.session, articles: articles })
})

router.post('/addComment', async (req, res) => {
  const { id, content } = req.body
  if (!req.session.username || req.session.username === '') {
    res.redirect('../users/login')
  } else {
    const writter = User.findOne({ username: req.session.username })
    const comment = {
      _writer: writter._id,
      content: content
    }
    const article = await Article.findById(id)
    if (!article.comments) {
      article.comments = []
    }
    article.comments.push(comment)
    console.log(article)
    await article.save()
  }
  res.render('index', { session: req.session })
})

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

module.exports = {
  router
}
