## 1
## 1
以下の二つのヘッダーを教えてください
- クライアントがサーバーへcookieを送信する際に利用するヘッダー
  - [Cookieヘッダー](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Cookie)
- サーバーがクライアントへcookieを送信する際に利用するヘッダー
  - [Set-Cookieヘッダー](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Set-Cookie)

## 2
- `https://example.com`
- `https://example.org`

上記二つのオリジンからのアクセスのみを許可しているサーバーが`https://example.com`というオリジンからリクエストを受けた場合、レスポンスのAccess-Control-Allow-Originヘッダーはどのようになるべきでしょうか？

`Access-Control-Allow-Origin: https://example.com`

> オリジンを指定します。1つのオリジンだけを指定することができます。サーバーが複数のオリジンからのクライアントに対応している場合、リクエストを行った特定のクライアントのオリジンを返さなければなりません。

https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Access-Control-Allow-Origin

## 3
サーバーがクライアントからのリクエストに対し、以下の条件でクッキーを含むレスポンスを返す場合のSet-Cookieヘッダーはどのようになるでしょうか？
- cookie名：値の組み合わせ
  - foo：bar
- クライアントから、JavaScriptのDocument.cookieでアクセスされたくない

`Set-Cookie: foo=bar; HttpOnly`

https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Set-Cookie#directives
