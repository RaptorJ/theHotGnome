const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }]
})

const Cart = mongoose.model('Cart', cartSchema)
module.exports = Cart
