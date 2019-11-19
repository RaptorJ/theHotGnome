const mongoose = require('mongoose')
const Schema = mongoose.Schema

var articleSchema = new Schema({
  // _seller: { type: Schema.Types.ObjectId, ref: 'User' },
  seller: { type: String, require: true },
  title: { type: String, require: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  price: { type: Number, require: true },
  image: { type: String },
  number: { type: Number, require: true },
  comments: [{
    _writer: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }]
})

const Article = mongoose.model('Article', articleSchema)
module.exports = Article
