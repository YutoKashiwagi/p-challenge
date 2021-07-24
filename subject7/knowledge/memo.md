## なぜキャッシュが必要なのか

繰り返し利用する結果をいちいち再計算、再取得していると遅くなるため

## キャッシュの種類

- プライベートキャッシュ
  - 一人のユーザーのためのキャッシュ
    - ブラウザキャッシュ、プロキシキャッシュなど

- 共有キャッシュ
  - 複数のユーザーのためのキャッシュ
    - CDNなど

### ブラウザキャッシュ

HTTPで取得したページをブラウザに保存する

### プロキシキャッシュ

プロキシサーバーで、複数のユーザーが繰り返す利用するレスポンスをキャッシュする。プロキシキャッシュを利用することで、ネットワークのトラフィック軽減が期待できる

### HTTPキャッシュ

HTTPリクエストに対するレスポンスをキャッシュする。GETリクエストの結果をキャッシュすることが望ましい

## キャッシュを制御するヘッダー

### Cache-Control

https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Cache-Control

個別のレスポンスをブラウザや他の中間キャッシュで保存する場合に許可する保存方法と有効期限を定義する

### Expires

https://www.mnot.net/cache_docs/#EXPIRES

クライアントがリクエストした時間、サーバーがリソースを変更した時間など、時間指定でキャッシュの制御を行うヘッダー

時間で制御するため、
- それほど変更がないページ、アセット
- 決まった時間に更新されるページ

のキャッシュ制御に向いてる

### Varyヘッダー

後続のリクエストをキャッシュさせたい場合に指定する。指定したヘッダーを持つ後続のリクエストをキャッシュする

## ブラウザのキャッシュ上限

todo

## 動的なページのキャッシュにexpiresを使うべきではない

### 理由

expiresは期間のみに依存するキャッシュ方法なため、変更を即時に反映する必要のあるマイページなどのキャッシュには向いていない

### 動的ページのキャッシュ方法

if-modified-sinceなど、変更を確認しつつキャッシュを利用するようにする

# キャッシュを使うべきでない状況

# クイズ

## memo

- 主要なキャッシュキーはリクエストメソッドとURIだけで構成される
  - GETが一般的なことから、URIだけの場合も

- Cache-Controlヘッダ
  - no-storeとno-cashe
    - no-store: キャッシュ自体しない
    - no-cache: キャッシュはするが、サーバーに検証用のリクエストを送信する
  - private, public
    - public
      - 通常キャッシュできないレスポンスをキャッシュできるようにする
        - 通常キャッシュできないHTTP認証、レスポンスステータスコードを使うページをキャッシュしたいときに使う
    - private
      - 共有キャッシュに保存してはいけないということを示す
  - max-age
    - 一番大事なディレクティブ

- varyヘッダー

>`Vary: Accept`
You could read this as, “This response varies based on the value of the Accept header of your request.”

- 鮮度
  - https://developer.mozilla.org/ja/docs/Web/HTTP/Caching#freshness
  - 鮮度の寿命計算は複雑なので注意

## 参考

- https://qiita.com/anchoor/items/2dc6ab8347c940ea4648

- https://developers.google.com/speed/docs/insights/LeverageBrowserCaching

- https://blog.redbox.ne.jp/http-header-tuning.html
