## 1

curlコマンド
`curl -G -H 'X-Test:hello' https://httpbin.org/headers`

## 2

curlコマンド
`curl -H 'Content-Type: application/json' -X POST -d '{ "name": "hoge"  }' https://httpbin.org/post`

## 3

curlコマンド
`curl -H 'Content-Type: application/x-www-form-urlencoded' -X POST -d '{ "name": "hoge"  }' https://httpbin.org/post`

## 4

curlコマンド
`curl -H 'Content-Type: application/json' -X POST -d '{"userA": {"name": "hoge", "age": 29}}' https://httpbin.org/post`

curl -i -H 'Content-Type: application/json' -X POST -d '{ "name": "kashiwamochi", "email": "kashiwagi19950714@gmail.com" }' http://challenge-your-limits.herokuapp.com/challenge_users 
