## 1

### XSS

#### 仕組み

Webサービスで、コメント機能などのユーザーからの入力値をブラウザに表示する部分に文字列としてhtmlタグやscriptタグなどが埋め込まれた場合、ブラウザ上で埋め込まれた任意のscriptやhtmlが実行されてしまう

#### 発生しうる被害

任意のJavaScriptを実行できるため、罠サイトへの誘導や、cookieなどの認証情報を抜き取られたりする

#### 対処法

- Webサービス上にユーザーからの入力値を表示する際、サニタイズ(タグの無効化)してから表示する
- 認証情報など重要な情報を含むcookieにはサーバーサイドでHttp-Only属性を付与し、client側からJavaScriptでアクセスできないようにしておく

### コマンドインジェクション

#### 仕組み

サーバー内のシェルを起動できる関数や、受け取った文字列をプログラムとして実行するeval関数などでユーザーからの入力値を受け付ける場合、悪意のあるコマンドが実行可能となる

#### 発生しうる被害

- 各種OSコマンドによるシステムの不正な操作を実行可能にしてしまう

#### 対処法

- eval関数や、シェルを起動できる関数を極力使わない
  - そこにユーザーからの入力値を渡さない

### SQLインジェクション

#### 仕組み

ユーザーからの入力値をSQLに渡す際、攻撃者がSQLとして有効な文字列を入力されると、開発者が意図しない形で攻撃者の任意のSQLが実行されてしまう脆弱性

シングルクォートなどを用いて、リテラルからはみ出した文字列をSQLとして認識させることによって任意のSQLが実行可能になる

#### 発生しうる被害

- 任意のSQLが実行可能になるため、データの改竄、削除などを許してしまう

#### 対処法

- ユーザーからの入力値をバリデーションする
- ユーザーからの入力値をそのままSQLに渡さない
- 生のSQLを極力書かず、ORMやクエリビルダ系のライブラリを利用する(基本的にSQLインジェクションの対策がされているため)

### CSRF

#### 仕組み

1. 罠サイト上で、ターゲットとなるサイトへクロスオリジンのリクエストを送信するフォーム(またはJS)を用意しておく
2. ターゲットとなるサイトへログインしているユーザーを罠サイトへ誘導し、フォームを踏ませる
3. ログイン済ユーザーの認証情報とともにクロスオリジンのリクエストが送信され、ログイン済ユーザーのターゲットとなるサイト上での振る舞いが偽装される

#### 発生しうる被害

- ログイン済の本人として、元々ターゲットとなるサイト上で許可されている行為が実行可能となる
  - SNSの乗っ取りや、不正な支払いが実行を許可してしまう

#### 対処法

- CORSの仕組みにのっかり、単純なリクエスト(元々formで送信可能なクロスオリジンのリクエスト)による副作用を許可しない
- CORSの設定を正しくおこなう
- 副作用のあるリクエストにはクレデンシャルとともにCSRFトークンも用いて認証を行う

## 2 クイズ

- 反射型XSS, 持続型XSS, DOM Based XSSの違いについて教えてください
- SQLインジェクションの対策として有効なプレイスホルダーに関してのクイズです。静的プレイスホルダーと動的プレイスホルダーの違いを教えてください
- 動的プレイスホルダーより静的プレイスホルダーを使うことが望ましいと言われていますが、その理由を教えてください


## 3

CSRFについては、expressで攻撃用のアプリを作りました

それぞれの防御手段に関しては1の対処法のところに記載しています