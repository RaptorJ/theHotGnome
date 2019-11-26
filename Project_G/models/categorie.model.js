const mongoose = require('mongoose')
const Schema = mongoose.Schema

var categorieSchema = new Schema({
  name: {
    type: String,
    enum: ['Jeux_video_Console', 'Papeterie', 'Informatique', 'Produit_tiers', 'Autre']
  }
})

const Categorie = mongoose.model('Categorie', categorieSchema)
module.exports = Categorie
