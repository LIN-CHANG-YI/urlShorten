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
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/url', (req, res) => {
  const link = req.body.url
  const random = randomLetter()
  URL.find({ random: `${random}` })
    .lean()
    .then(exist => {
      //判斷是否有一樣組合的網址
      if (exist.length === 1) {
        res.redirect('/')
      } else {
        URL.create({ url: `${link}`, random: `${random}` })
          .then(() => {
            const url = `${req.headers.origin}/${random}`
            res.render('shorten', { url })
          })
          .catch(error => console.log(error))
      }
    })
    .catch(error => console.log(error))
})

app.get('/:random', (req, res) => {
  const params = req.params.random
  URL.findOne({ random: `${params}` })
    .then((item) => res.redirect(`${item.url}`))
    .catch(error => console.log(error))
})

app.listen(PORT, () => {
  console.log('Express is listen on port 3000.')
})