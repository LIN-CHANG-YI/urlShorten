const mongoose = require('mongoose')
const Schema = mongoose.Schema
const urlSchema = new Schema({
  url: String,
  random: {
    type: String,
    unique: true
  },
  newUrl: String
})

module.exports = mongoose.model('URL', urlSchema)