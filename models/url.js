const mongoose = require('mongoose')
const Schema = mongoose.Schema
const urlSchema = new Schema({
  url: String,
  random: String
})

module.exports = mongoose.model('URL', urlSchema)