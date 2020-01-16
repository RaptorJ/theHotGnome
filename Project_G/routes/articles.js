const express = require('express')
var router = express.Router()

const Article = require('../models/article.model')
const User = require('../models/user.model')
const Category = require('../models/Categorie.model')

let availableTag = []
router.use(express.static('views'))

/**
 * Route to get access to the article creation page
 * @name /new
 * @route {GET} /new
 * @param {string} req - test
 */
router.get('/new', async (req, res) => {
  if (!req.session.role || req.session.role !== 'admin') {
    console.log('Unautorysed connection (Role)')
    res.redirect('cart')
  } else {
    console.log('Get new article page')
    const categories = await Category.find({})
    availableTag = []
    await asyncForEach(categories, async (obj) => {
      availableTag.push(obj.name)
    })
    res.render('newArticle', { session: req.session, availableTag: availableTag })
  }
})

// Route to get to the article informations
/**
 * Route to get article information page
 * @name get/info
 * @function
 * @memberof module:routers/articles~articlesRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
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
/**
 * Function that return all the names of articles in database
 */
async function getAvailableTags () {
  const articles = await Article.find({})
  availableTag = []
  await asyncForEach(articles, async (obj) => {
    availableTag.push(obj.title)
  })
}

// Get items for index page
/**
 * Function that return the last items added in database
 * @return {array} items, the array containing the last items added
 *             in database
 */
async function getLatestItems () {
  const items = []
  const articles = await Article.find({})
  for (let i = 0; i < 3; i++) {
    items.push(articles[articles.length - 1 - i])
  }
  return items
  // console.log(availableTag)
}

/**
 * Route to get article page
 * @name get/getArticle
 * @function
 * @memberof module:routers/articles~articlesRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/getArticle', async (req, res) => {
  const article = await Article.findById(req.query.id)
  console.log('get article ' + article.title)
  res.render('viewArticle2', { session: req.session, article: article })
})

/**
 * Route to add an article to the wishlist of the current user
 * @name get/addToWishList
 * @function
 * @memberof module:routers/articles~articlesRouter
 * @inner
 * @param {string} path - Express path
 * @param {string} id - the id of the article to add
 * @param {callback} middleware - Express middleware.
 */
router.get('/addToWishList', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.session.username })
    const article = await Article.findById(req.query.id)
    console.log('id de larticle: ' + req.query.id)
    console.log(article)
    if (!article) {
      res.status(404).send('err article: id inconnu')
      return
    }
    // check that the item is not already in the wishlist
    for (let i = 0; i < user.wishList.length; i++) {
      if (user.wishList[i]._id.toString() === article._id.toString()) {
        console.log('already in the wishList')
        res.redirect('/')
        return
      }
    }
    if (!user.wishList) {
      user.wishList = []
    }
    // ajout dans la wishList
    user.wishList.push(article)
    console.log(user.wishList)
    await user.save()
    res.redirect('/')
  } catch (err) {
    console.log(err)
    res.status(403).send(err)
  }
})

/**
 * Route to get access to the current user's wishlist page
 * @name get/whishlist
 * @function
 * @memberof module:routers/articles~articlesRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/whishlist', async (req, res) => {
  if (!req.session.username || req.session.username === '') {
    res.redirect('/users/login')
  } else {
    console.log(`Consulting whishlist of: ${req.session.username}`)
    const user = await User.findOne({ username: req.session.username })
    console.log(user.wishList)
    let article
    const whishlist = []
    await asyncForEach(user.wishList, async (obj) => {
      article = await Article.findById(obj._id)
      whishlist.push(article)
    })
    res.render('whishlist', { session: req.session, whishlist: whishlist })
  }
})

/**
 * Route to remove an article from the wishlist of the current user
 * @name get/removeFromWhishlist
 * @function
 * @memberof module:routers/articles~articlesRouter
 * @inner
 * @param {string} path - Express path
 * @param {string} id - the id of the article to remove
 * @param {callback} middleware - Express middleware.
 */
router.get('/removeFromWhishlist', async (req, res) => {
  const user = await User.findOne({ username: req.session.username })
  for (let i = 0; i < user.wishList.length; i++) {
    if (user.wishList[i]._id.toString() === req.query.id.toString()) {
      user.wishList.splice(i, 1)
    }
  }
  await user.save()
  res.redirect('whishlist')
})

/**
 * Route used by the searchbar of the website
 * Get the page of the article in request if the name match one in
 * the database, or give the list of articles where the names match
 * with the title gave in the searchbar
 * @name post/getArticleList
 * @function
 * @memberof module:routers/articles~articlesRouter
 * @inner
 * @param {string} path - Express path
 * @param {string} title - The article name
 * @param {callback} middleware - Express middleware.
 */
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
/**
 * Route to get access to the list of the available articles names
 * This route is used with AJAX
 * @name post/products
 * @function
 * @memberof module:routers/articles~articlesRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/products', async (req, res) => {
  await getAvailableTags()
  res.send(availableTag)
})

// Adding the item to the cart of the user connected
/**
 * Route to add an article to the cart of the current user
 * If the user is not connected, the route is saved and the user is
 * redirected to login page
 * @name get/addToCart
 * @function
 * @memberof module:routers/articles~articlesRouter
 * @inner
 * @param {string} path - Express path
 * @param {string} id - the id of the article to add
 * @param {callback} middleware - Express middleware.
 */
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
      // res.render('index', { session: req.session })
      return
    } catch (err) {
      console.log(err)
      res.status(403).send(err)
    }
  }
})

/**
 * Route to get access to the cart of the current user
 * @name get/cart
 * @function
 * @memberof module:routers/articles~articlesRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/cart', (req, res) => {
  res.render('cart', { session: req.session, articles: req.session.cart })
})

// Removing an item form the cart
// Change from POST to GET
/**
 * Route to remove an article from the cart
 * @name get/removeFromCart
 * @function
 * @memberof module:routers/articles~articlesRouter
 * @inner
 * @param {string} path - Express path
 * @param {string} id - the id of the article to remove
 * @param {callback} middleware - Express middleware.
 */
router.get('/removeFromCart', (req, res) => {
  for (let i = 0; i < req.session.cart.length; i++) {
    if (req.session.cart[i]._id === req.query.id) req.session.cart.splice(i, 1)
  }
  res.redirect('cart')
})

/**
 * Route to confirm the cart and buy all the article inside it
 * If one article is not available, it is removed from the cart
 * and the user is redirected to the cart view page
 * If the action goes well, it will create an order object to save
 * the transaction
 * @name get/buyCart
 * @function
 * @memberof module:routers/articles~articlesRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
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
      // If the article is in the wishlist of the user, remove it
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
    res.render('index', { session: req.session, items: getLatestItems })
  } catch (err) {
    console.log(err)
    res.status(403).send(err)
  }
})

/** ** creating an article ** **/
/**
 * Route to create a new article in the database
 * @name post/new
 * @function
 * @memberof module:routers/articles~articlesRouter
 * @inner
 * @param {string} path - Express path
 * @param {string} seller, the seller of the article
 * @param {string} title, the article name
 * @param {string} content, the article descritpion
 * @param {number} price, the price of the article
 * @param {number} number, the original number of article stored
 * @param {string} category, the category of the article
 * @param {string} image, the link of the article image
 * @param {callback} middleware - Express middleware.
 */
router.post('/new', async (req, res) => {
  const { seller, title, content, price, number, category, image } = req.body
  if (!(title) || !(seller) || !(content) || !(price) || !(number) || !(category)) {
    res.status(403).send('You did not put enough information!')
    return
  }
  const article = await Article.findOne({ title: title })
  const cat = await Category.findOne({ name: category })
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
    res.render('index', { session: req.session, items: getLatestItems })
    console.log(`New article successfully added: ${title}`)
    return
  } catch (err) {
    res.status(404).render('404', { session: req.session })
  }
})

// Uptade some informations (content or price) using the title (primary key)
/**
 * Route to update an article information
 * @name post/update
 * @function
 * @memberof module:routers/articles~articlesRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @param in title, the name of the article
 * @param in content, the article description
 * @param in price, the article price
 */
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
/**
 * Route to delete an article from the database
 * @name post/deleteItem
 * @function
 * @memberof module:routers/articles~articlesRouter
 * @inner
 * @param {string} path - Express path
 * @param {string} id - the id of the article to remove
 * @param {callback} middleware - Express middleware.
 */
router.post('/deleteItem', async (req, res) => {
  const { id } = req.body
  if (!req.session.role || req.session.role !== 'admin') {
    console.log('Unautorysed connection (Role)')
    res.redirect('cart')
  } else {
    try {
      await Article.deleteOne({ id: id })
      getAvailableTags()
      res.redirect('/')
      return
    } catch (err) {
      res.status(403).send(err)
    }
  }
})

/**
 * Route to get the list of article of a category
 * @name get/productsTpe
 * @function
 * @memberof module:routers/articles~articlesRouter
 * @inner
 * @param {string} path - Express path
 * @param {string} type - the category of articles
 * @param {callback} middleware - Express middleware.
 */
router.get('/productsType', async (req, res) => {
  const type = req.query.type
  console.log(type)
  if (!type) {
    res.render('404', { session: req.session })
    return
  }
  const CategoryId = await Category.findOne({ name: type })
  console.log(CategoryId)
  const articles = await Article.find({ categories: CategoryId })
  console.log('articles: ' + articles)
  res.render('viewArticleList', { session: req.session, articles: articles })
})

/**
 * Route used to post a comment in an article page
 * If the user is not logged in, he is redirected to login page
 * and the original route is save for redirection after login
 * @name post/addComment
 * @function
 * @memberof module:routers/articles~articlesRouter
 * @inner
 * @param {string} path - Express path
 * @param {string} id - the id of the article to comment
 * @param {string} content - the comment of the user
 * @param {callback} middleware - Express middleware.
 */
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

/**
 * Function to call to make asynchronous ForEach
 * @param {array} array, an array of element to iterate on
 * @param {callback} callback, the function to call for each element
 */
async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

module.exports = {
  router,
  getLatestItems
}
