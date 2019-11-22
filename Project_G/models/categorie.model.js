const mongoose = require('mongoose')
const Schema = mongoose.Schema

var categorieSchema = new Schema({
  name: {
    type: String,
    enum: ['Jeux video & Console', 'Papeterie', 'Informatique', 'Produit tiers', 'Autre']
  }
})

const Categorie = mongoose.model('Categorie', categorieSchema)
module.exports = Categorie
