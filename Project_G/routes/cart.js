const express = require('express')
var router = express.Router()

const Cart = require('../models/cart.model.js')

router.use(express.static('views'))

router.get('/new', (req, res) => {
  // Verify that user is admin -> todo
  console.log('Get new article page')
  res.render('newArticle')
})
