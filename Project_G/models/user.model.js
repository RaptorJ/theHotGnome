const mongoose = require('mongoose')
const Schema = mongoose.Schema

var userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  mail: { type: String, require: true },
  birthDate: { type: Date, require: true },
  role: {
    type: String,
    enum: ['user', 'premium', 'admin'],
    default: 'user'
  },
  address: {
    street: { type: String, require: true }, // and number (ex :  8 rue Dupond)
    city: { type: String, require: true },
    postalCode: { type: Number, require: true },
    country: { type: String, require: true }
  },
  orders: [{
    username: { type: String, require: true }, // the owner of the order
    articles: [{ type: String, requierd: true }],
    price: { type: Number, require: true }
  }],
  wishList: [{
    articles: { type: Schema.Types.ObjectId, ref: 'Article' }
  }]
})

const User = mongoose.model('User', userSchema)

module.exports = User
