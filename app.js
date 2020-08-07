const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const randomLetter = require('./random.js')
const URL = require('./models/url.js')

const PORT = 3000
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
mongoose.connect('mongodb://localhost/URL', { useNewUrlParser: true, useUnifiedTopology: true })

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
  URL.create({ url: `${req.body.url}/${random}` })
    .then(() => {
      const url = `${req.headers.origin}/${random}`
      res.render('shorten', { url, link })
    })
    .catch(error => console.log(error))
})

app.listen(PORT, () => {
  console.log('Express is listen on port 3000.')
})