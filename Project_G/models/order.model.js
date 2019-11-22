const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
  username: { type: String, require: true }, // the owner of the order
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }]
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order
