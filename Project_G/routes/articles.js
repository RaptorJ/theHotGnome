const express = require('express')
var router = express.Router()

const Article = require('../models/article.model')
const User = require('../models/user.model')
const Categorie = require('../models/categorie.model')

let availableTag = []
router.use(express.static('views'))

router.get('/new', async (req, res) => {
  if (!req.session.role || req.session.role !== 'admin') {
    console.log('Unautorysed connection (Role)')
    res.redirect('cart')
  } else {
    console.log('Get new article page')
    const categories = await Categorie.find({})
    availableTag = []
    await asyncForEach(categories, async (obj) => {
      availableTag.push(obj.name)
    })
    res.render('newArticle', { session: req.session, availableTag: availableTag })
  }
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
}

// Get items for index page
async function getLatestItems () {
  const items = []
  const articles = await Article.find({})
  for (let i = 0; i < 3; i++) {
    items.push(articles[articles.length - 1 - i])
  }
  return items
}

router.get('/getArticle', async (req, res) => {
  const article = await Article.findById(req.query.id)
  console.log('get article ' + article.title)
  res.render('viewArticle2', { session: req.session, article: article })
})

router.get('/addToWishList', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.session.username })
    const article = await Article.findById(req.query.id)
    console.log('id de larticle: ' + req.query._id)
    console.log(article)
    if (!article) {
      res.status(404).send('err article: id inconnu')
      return
    }
    // check si l'item n'est pas déjà dans la wishlist
    for (let i = 0; i < user.wishList.lengt; i++) {
      if (user.wishList[i]._id === article._id) {
        console.log('already in the wishList')
        res.redirect('/')
        return
      }
    }
    // ajout dans la wishList
    user.wishList.push(article)
    user.save()
    res.redirect('/')
  } catch (err) {
    console.log(err)
    res.status(403).send(err)
  }
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

// List of product name for search bar
router.post('/products', async (req, res) => {
  await getAvailableTags()
  res.send(availableTag)
})

// Adding the item to the cart of the user connected
router.get('/addToCart', async (req, res) => {
  const id = req.query.id
  if (!req.session.username || req.session.username === '') {
    req.session.urlorigin = `/articles/addToCart?id=${id}`
    res.redirect('../users/login')
  } else {
    try {
      const article = await Article.findById(id)
      req.session.cart.push(article)
      console.log('Cart: ' + req.session.cart)
      res.redirect('cart')
      return
    } catch (err) {
      console.log(err)
      res.status(403).send(err)
    }
  }
})

router.get('/cart', (req, res) => {
  res.render('cart', { session: req.session, articles: req.session.cart })
})

// Removing an item form the cart
router.get('/removeFromCart', (req, res) => {
  for (let i = 0; i < req.session.cart.length; i++) {
    if (req.session.cart[i]._id === req.query.id) req.session.cart.splice(i, 1)
  }
  res.redirect('cart')
})

router.get('/buyCart', async (req, res) => {
  const articlesToBuy = req.session.cart
  if (articlesToBuy.length === 0) {
    console.log('EmptyCart lol bug')
  }
  try {
    await asyncForEach(articlesToBuy, async (obj) => {
      const article = await Article.findOne({ title: obj.title })
      if (article.number === 0) {
        console.log('the article is no longer in stock')
        for (let i = 0; i < req.session.cart.length; i++) {
          if (req.session.cart[i]._id === article.id) req.session.cart.splice(i, 1)
        }
        res.redirect('cart')
      }
    })
    const articlesName = []
    const user = await User.findOne({ username: req.session.username })
    await asyncForEach(articlesToBuy, async (obj) => {
      const article = await Article.findOne({ title: obj.title })
      article.number--
      await article.save()
      articlesName.push(obj.title)
      // Si l'article est dans la wishList, le supprimer à l'achat
      for (let i = 0; i < user.wishList.lengt; i++) {
        if (user.wishList[i]._id === article._id) {
          console.log('bip' + i)
          user.wishList.splice(i, 1)
        }
      }
    })
    const order = {
      username: req.session.username,
      articles: articlesName,
      price: req.query.price
    }
    user.orders.push(order)
    await user.save()
    req.session.cart = []
    res.redirect('/')
  } catch (err) {
    console.log(err)
    res.status(403).send(err)
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
    res.redirect('/')
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
    res.redirect('/')
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
  res.render('viewArticleList', { session: req.session, articles: articles })
})

router.post('/addComment', async (req, res) => {
  const { id, content } = req.body
  if (!req.session.username || req.session.username === '') {
    req.session.urlorigin = `/articles/getArticle?id=${id}`
    res.redirect('../users/login')
  } else {
    const writter = await User.findOne({ username: req.session.username })
    const comment = {
      _writer: writter._id,
      writerName: req.session.username,
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
  res.redirect(`/articles/getArticle?id=${id}`)
})

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

module.exports = {
  router,
  getLatestItems
}
