const mongoose = require('mongoose')
const Schema = mongoose.Schema

var roleSchema = new Schema({
  name: {
    type: String,
    enum: ['user', 'premium', 'admin'],
    default: 'user'
  }
})

const Role = mongoose.model('Role', roleSchema)
module.exports = Role
