const express = require('express')
var router = express.Router()

const Article = require('../models/article.model')
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
    res.render('article', { article: article })
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
  console.log(availableTag)
}

router.get('/getArticle', async (req, res) => {
  const article = await Article.findById(req.param.id)
  console.log('get article ' + article.name)
  res.render('viewArticle', { article: article })
})

router.post('/getArticleList', async (req, res) => {
  let article = await Article.findOne({ title: req.body.title })
  if (article) {
    res.send('viewArticle', { article: article })
  } else {
    const availableItemId = []
    await asyncForEach(availableTag, async (obj) => {
      if (obj.search('.[' + req.title + '].')) {
        article = await Article.findOne({ title: obj.title })
        availableItemId.push(obj.id)
      }
    })
    res.render('viewArticleList', { idList: availableItemId })
  }
})

// List of product name for search barS
router.post('/products', async (req, res) => {
  await getAvailableTags()
  res.send(availableTag)
})

// Adding the item to the cart of the user connected
router.post('/addToCart', async (req, res) => {
  const { id } = req.body
  try {
    const article = await Article.findById(id)
    req.session.cart.push(article)
    return
  } catch (err) {
    console.log(err)
    res.status(403).send(err)
  }
})

// Removing an item form the cart
router.post('/removeFromCart', (req, res) => {
  for (let i = 0; i < req.session.cart.length; i--) {
    if (req.session.cart[i].id === req.param.id) req.session.cart.splice(i, 1)
  }
})

/** ** creating an article ** **/
router.post('/new', async (req, res) => {
  const { seller, title, content, price, number, categorie } = req.body
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
      categories: cat,
      number: number
    })
    await newArticle.save()
    getAvailableTags()
    res.render('index')
    console.log(`New article successfully added: ${title}`)
    return
  } catch (err) {
    res.status(404).render('404')
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

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

module.exports = {
  router
}
