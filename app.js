const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const randomLetter = require('./random.js')
const URL = require('./models/url.js')
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/URL'

const PORT = process.env.PORT || 3000
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.get('/', (req, res) => {
  URL.find()
    .lean()
    .limit(5)
    .sort({ _id: 'DESC' })
    .then(totalurl => res.render('index', { totalurl }))
    .catch(error => res.send(String(error)))
})

app.post('/getUrl', (req, res) => {
  const link = req.body.url
  generatRandom()
  function generatRandom() {
    const random = randomLetter()
    URL.findOne({ random })
      .lean()
      .then(exist => {
        if (exist) {
          return generatRandom()
        }
        return URL.create({ url: link, random, newUrl: `${req.headers.origin}/${random}` })
      })
      .then((data) => res.render('shorten', { url: data.newUrl }))
      .catch(error => res.send(String(error)))
  }
})

app.get('/:random', (req, res) => {
  const params = req.params.random
  URL.findOne({ random: params })
    .then((data) => res.redirect(`${data.url}`))
    .catch(error => res.send(String(error)))
})

app.listen(PORT, () => {
  console.log('Express is listen on port 3000.')
})