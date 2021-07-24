const express = require('express')

const app = express()
const port = 3000

app.set('views', './views/')
app.set('view engine', 'ejs')

// デフォルトの設定(デフォルトでキャッシュされる)
app.use('/static/using-cache', express.static('public/using-cache'))

// キャッシュをオフに
app.use('/static/without-cache', express.static('public/without-cache', {
  etag: false,
  lastModified: false
}))

app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-store') // ページのキャッシュをオフにする
  res.render('index')
})

app.listen(port, () => {
  console.log('run')
})
