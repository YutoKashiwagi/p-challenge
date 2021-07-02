const express = require('express')

const app = express()
const port = 3000

app.set('views', './views/')
app.set('view engine', 'ejs');

// ngrokのドメイン
const thirdPartyDomain = '321e356d08c3.ngrok.io'

app.get('/', (req, res) => {
  res.cookie('firstparty', 'value', {
    httpOnly: true,
  })

  res.render('index', {
    thirdPartyDomain
  })
})

app.listen(port, () => {
  console.log('first party app is running')
})

const thirdPartyApp = express()
const thirdPartyPort = 3001

thirdPartyApp.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', `http://localhost:${port}`)
  res.header('Access-Control-Allow-Credentials', true)

  res.cookie('thirdparty', 'value', {
    httpOnly: true,
    domain: thirdPartyDomain,
    sameSite: 'none',
    secure: true
  })

  res.json({
    success: true
  })
})

thirdPartyApp.listen(thirdPartyPort, () => {
  console.log('third party app is running')
})
