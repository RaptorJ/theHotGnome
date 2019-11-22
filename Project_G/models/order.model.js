const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
  username: { type: String, require: true }, // the owner of the cart
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }]
})

const Order = mongoose.model('Cart', orderSchema)
module.exports = Order
