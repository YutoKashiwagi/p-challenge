## 1
### 1-1
- Host

リクエストヘッダー。
リクエストの送信先のホスト名とポート名を記載する

例
`Host: localhost:3000`

[参考](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Host)

- Content-type

エンティティヘッダー。
リソースのMIMEタイプを記述する。
`application/json`でお馴染み

[参考](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Content-Type)

- User-agent
リクエストヘッダー。
サーバーやネットワークピアがアプリケーション、オペレーティングシステム、ベンダーや、リクエストしているユーザーエージェントのバージョン等を識別できるようにする特性文字列

[ユーザーエージェント](https://developer.mozilla.org/ja/docs/Glossary/User_agent)は個人を表すコンピューターのプログラムで、例えばウェブにおけるブラウザーに当たるもの

[参考](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/User-Agent)

- Accept
リクエストヘッダー。
クライアントが解釈可能なMIMEタイプをリクエストヘッダーに指定して送信すると、サーバーはレスポンスのContent-Typeにこれを設定する

[参考](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Accept)

- Referer
リクエストヘッダー。
現在リクエストされているページへのリンク先を持った直前のウェブページのアドレスが含まれる。 Referer ヘッダーにより、サーバーは人々がどこから訪問しに来たかを識別し、分析、ログ、キャッシュの最適化などに利用することができる

referer は実際には "referrer" という単語のスペルミスという話が有名

[参考](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Referer)

- Accept-Encoding

リクエストヘッダー
Acceptヘッダーはクライアントが望むコンテンツのMIMEタイプを指定するのに対し、こちらはクライアントが望むコンテンツのエンコーディング、ふつうは圧縮アルゴリズムを指定する

指定された値はContent-Encodingレスポンスヘッダーに格納される

[参考](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Accept-Encoding)

- Authorization

リクエストヘッダー。
ユーザーエージェントがサーバーから認証を受けるために、認証情報を格納するヘッダー

[参考](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Authorization)

- Location
レスポンスヘッダー。
リダイレクト先のURLを格納する

[参考](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Location)

### 1-2
- noreferrerが必要な理由
  - `target="_blank"` を使用して任意のページから別のページにリンクしている場合、リンク元のページとリンク先のページは同じプロセスで動作するため、リンク先のページで負荷の高いJSが実行されていると、リンク元のページのパフォーマンスが低下するおそれがある

  - `target="__blank"`には、リンク先のページでwindow.openerを使用して親ウィンドウのオブジェクトにアクセスしたり、window.opener.location = newURL によって親ページのURLを変更したりできる脆弱性がある

[参考](https://web.dev/external-anchors-use-rel-noopener/)

- noreferrerを設定しないとどうなるか
  - 上記に加え、windowオブジェクトにアクセスされると
    - windowオブジェクトからDOMが操作され、フィッシング被害に遭う可能性がある
    - windowオブジェクトから操作できるライブラリを使用している場合、操作される可能性がある

- 同じオリジンの時はrefererの情報を全部送って、別オリジンの時は、オリジン情報だけをrefererとして送信する
  - `Referrer-Policy: origin-when-cross-origin`
  - [参考](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Referrer-Policy)

### クイズ
## 1
以下の二つのヘッダーを教えてください
- クライアントがサーバーへcookieを送信する際に利用するヘッダー
- サーバーがクライアントへcookieを送信する際に利用するヘッダー

## 2
- `https://example.com`
- `https://example.org`

上記二つのオリジンからのアクセスのみを許可しているサーバーが`https://example.com`というオリジンからリクエストを受けた場合、レスポンスのAccess-Control-Allow-Originヘッダーはどのようになるべきでしょうか？

## 3
サーバーがクライアントからのリクエストに対し、以下の条件でクッキーを含むレスポンスを返す場合のSet-Cookieヘッダーはどのようになるでしょうか？
- cookie名：値の組み合わせ
  - foo：bar
- クライアントから、JavaScriptのDocument.cookieでアクセスされたくない
