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

## クイズ

### curl

#### 1
curlのよく使うオプションを3つ以上教えてください

#### 2
curlの学習に使用したwebサイト、書籍などの学習リソースを2つ以上教えてください

#### 3
ブラウザ(Chrome)上から送信したリクエストをcurlで再現するためには、どのような方法があるでしょう？

### postman

#### 1
postmanのように、便利なHTTP clientツールを他に二つ以上教えてください

#### 2
postmanではリクエストのURLやヘッダー、ボディなどで環境変数を使用することができます
どのような値に環境変数を利用すると効果的でしょうか？例とその理由を教えてください

#### 3
問題2をPre-Request-Scriptを使ってレスポンスボデイを設定する形で再現してください
（Pre-Request-Scriptのコードのみ送ってもらえれば大丈夫です）
