const express = require('express')

const app = express()
const port = 3000

const api = express()
const apiPort = 3001

// ngrokのオリジン
const apiOrigin = 'https://6d1ba02d3ce2.ngrok.io'

/**
 * ページホスティング用サーバー
 */
app.set('views', './views/')
app.set('view engine', 'ejs');

// エントリーポイントのページレンダリング
app.get('/', (req, res) => {
  res.render('index', {
    apiOrigin
  })
})

app.listen(port, () => {
  console.log('run')
})

/**
 * 異なるポートのAPIサーバー
 */

// preflight request用の設定
api.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', `http://localhost:${port}`)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')  

  next()
})

// プリフライトリクエストが行われる
api.post('/', (req, res) => {
  res.json({
    foo: 'bar'
  })
})

// プリフライトリクエストが行われない
api.get('/', (req, res) => {
  console.log('simple request')
  res.end()
})

api.listen(apiPort, () => {
  console.log('api run')
})
