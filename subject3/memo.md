## Content-Typeが`Content-Type: application/json`のときと`Content-Type: application/x-www-form-urlencoded`のときではどう違うか

### `Content-Type: application/x-www-form-urlencoded`のとき
データ形式はクエリパラメータと同じ形式を想定している

例: `name=hoge`

### `Content-Type: application/json`のとき
データ形式はJSON形式を想定している。axiosのデフォルトのContent-Typeはこちらになっている

例: `{ "name": "hoge" }`
