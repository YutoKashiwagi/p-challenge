var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.status(200).json({
    text: 'hello world'
  })
});

router.post('/', function(req, res, next) {
  if (!req.is('application/json')) {
    res.status(400).send('Content-Typeはapplication/jsonを指定してください')
    return
  }

  const body = req.body
  res.status(200).json(body)
});

module.exports = router;
