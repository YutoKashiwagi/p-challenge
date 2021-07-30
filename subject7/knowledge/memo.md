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

## ブラウザのキャッシュ上限について

- ブラウザのストレージ容量は基本的に動的で、ハードディスクドライブのサイズに応じて変わる
- グローバルリミットはディスク空き容量の50%

https://developer.mozilla.org/ja/docs/Web/API/IndexedDB_API/Browser_storage_limits_and_eviction_criteria#storage_limits

### 削除方法

基本的に[LRU(Least Recently Used)ポリシー](https://ja.wikipedia.org/wiki/Least_Recently_Used)に基づいて、オリジンごとに削除される

#### origin eviction

ストレージの総量が上限に達した場合、オリジンごとにストレージを削除していく。オリジンごとに削除する理由は、あるオリジン内の一部のデータだけ削除すると矛盾が発生する可能性があるから

#### グループリミット

eTLD+1を一つのグループとしてまとめて、そのグループごとにキャッシュ上限をグローバルリミットの20%に指定する

https://developer.mozilla.org/ja/docs/Web/API/IndexedDB_API/Browser_storage_limits_and_eviction_criteria#storage_limits

> また、グループリミットというもうひとつの制限もあります。これは、グローバルリミットの 20% として定義されます。それぞれの生成元は、グループ (生成元のグループ) の一部です。グループは、eTLD+1 ドメインごとに 1 つ作られます。例えば次の通り:
mozilla.org — グループ 1、生成元 1
www.mozilla.org — グループ 1、生成元 2
joe.blogs.mozilla.org — グループ 1、生成元 3
firefox.com — グループ 2、生成元 4

### Chrome

#### 容量上限

デフォルトでは、利用可能なディスク容量の割合からキャッシュ上限を設定する。キャッシュ上限はバイト単位でユーザーが変更できる

https://cloud.google.com/blog/ja/products/chrome-enterprise/improvements-and-polices-make-chrome-more-performant

> ディスク使用量 DiskCacheSize: デフォルトで、Chrome はキャッシュの最大サイズを、利用可能なディスク容量の割合として計算し設定します。このポリシーは、Chrome が使用するキャッシュのサイズの上限を設定します。これは共有リソースを使用する仮想マシンにとって重要になる場合があります。上限は、合計ディスク容量（または通常の状況で予想される空きディスク容量）と、ディスク キャッシュ サイズの間の桁数にすることをおすすめします。たとえば、ディスク容量が 10 GB であれば、キャッシュの上限は 1 GB に設定します。

## 動的なページのキャッシュにexpiresを使うべきではない

### 理由

expiresは期間のみに依存するキャッシュ方法なため、変更を即時に反映する必要のあるマイページなどのキャッシュには向いていない

### 動的ページのキャッシュ方法

if-modified-sinceなど、変更を確認しつつキャッシュを利用するようにする

## 他サイトでの利用例


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
