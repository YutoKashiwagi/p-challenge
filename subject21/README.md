# 課題

## デッドロックとは

複数のトランザクションから同時に更新をかける時、お互いに競合するデータに対してロックをかけてしまい、ロック待ちで処理が終わらなくなる状態

## デッドロックの事例

https://japan.zdnet.com/article/35080846/

- 原因: 記事に記載
- 対策: デッドロック自体が起こらないように完全に制御するのは難しいので、デッドロックが発生した場合の対応を入れるのが現実的かと思います。上記の例ではデッドロックが発生して処理が止まり続けたことが問題なので、RDBMSが行なっているようなタイムアウト処理やロールバック処理が必要だsと思います

## ISOLATION LEVEL

- READ-UNCOMMITED
  - あるトランザクションデータを更新してまだコミットしていない時、そのデータを他のトランザクションから読み取ることができる
  - 許容する不具合
    - ダーティリード
    - ノンリピータブルリード
    - ファントムリード
  - ダーティリードを許容するため、ほとんど使われない

- READ-COMMITED
  - あるトランザクションでコミットしたデータを他のトランザクションから参照できる。コミット前のデータは読み取らないため、ダーティリードは発生しないが、ノンリピータブルリードは起こりうる
  - 許容する不具合
    - ノンリピータブルリード
    - ファントムリード

- REPEATABLE-READ
  - 同じトランザクション中では同じデータは何度読み取りしても毎回同じ値を読むことができる。しかし、ファントムリードは起こりうる
  - MySQLのトランザクション分離レベルのデフォルト値
  - 許容する不具合
    - ファントムリード
      - 一般にこのレベルではファントムリードは許容するが、MySQLはMVCCによってこのレベルでもファントムリードは起こらない

- SERIALIZABLE
  - トランザクションを直列に実行した結果と同じになることを保証する
  - 整合性は一番高いが、パフォーマンスは低い
  - 許容する不具合
    - 特になし

## テーブルロック、行レベルロック

MySQL（InnoDB）を前提とした説明です

- 行レベルロック
  - インデックスを使い、対象の行のみをロックする。他のトランザクションからは対象の行へのアクセスはブロックされるが、対象のテーブル自体や、他の行へはアクセス可能
- テーブルロック
  - テーブル自体をロックし、他のトランザクションからのテーブル自体へのアクセスをブロックする。更新対象の行にインデックスが貼られていないときやalter table時はテーブルロックになる

## 悲観ロックと楽観ロック

- 悲観ロック
  - DBのトランザクションを使ってロック処理を行う。DBレベルでロックをかけられるので整合性は保てるが、楽観ロックと比較すると処理は遅い

- 楽観ロック
  - DBのトランザクションを使わず、アプリ側で更新時にロックキーを使って値が変わっていないか確認して更新する処理
    - ロックキー
      - バージョンカラムや、updated_atなど

## 共有ロック、排他ロック

- 共有ロック
  - 他のトランザクションから読み取りは可能だが、更新はできないロック
- 排他ロック
  - 他のトランザクションからは読み取りも更新もできないロック
  - `select ... for update`はこちらに該当

## ノンリピータブルリードとファントムリードの違い

ノンリピータブルリードは同じデータを複数回読み取る時、合間に既存のデータが他のトランザクションによって更新されることで、データを読み取るタイミングによる不整合が起きる問題

ファントムリードは同じデータを複数回読み取る時、合間に新しいデータが追加されることで、データを読み取るタイミング次第で過去に存在しなかったデータが増えているという問題

# 実装課題

## 異常の再現

MySQLでのトランザクション分離レベルの確認　バージョン5.X用

```SQL
-- トランザクション分離レベル確認用SQL
SELECT @@GLOBAL.tx_isolation, @@tx_isolation;
```

@@GLOBAL.tx_isolationはグローバルに設定されているトランザクション分離レベルです。@@tx_isolationは現在のセッションで設定されているトランザクション分離レベル

[参考](https://marock.tokyo/2021/07/13/mysql-%E3%83%88%E3%83%A9%E3%83%B3%E3%82%B6%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3%E5%88%86%E9%9B%A2%E3%83%AC%E3%83%99%E3%83%AB%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95/)

トランザクション分離レベルの変更

```SQL
SET [GLOBAL|SESSION] TRANSACTION ISOLATION LEVEL 指定したいトランザクション分離レベル
```

異常を再現するために、簡単な口座テーブルを用意する

### 準備

以下のデータからスタートする

```
select * from balances;
+----+--------+---------+
| id | amount | user_id |
+----+--------+---------+
|  1 | 200000 |       1 |
|  2 | 200000 |       2 |
+----+--------+---------+
```


### ダーティリード

MySQLのデフォルトのトランザクション分離レベルはREPEATABLE READなので、ダーティリードを起こせない。
トランザクション分離レベルをREAD UNCOMMITTEDに変更しておく

```SQL
set transaction isolation level READ UNCOMMITTED;
```

トランザクションA, Bを作成し、トランザクションAで残高を増やし、コミット前にBから増えた残高を参照できてしまうことを確認する

トランザクションA開始
トランザクションAで、user_id = 1の残高を1万増やす

```SQL
-- Aのセッション
begin;

update balances set amount = amount + 10000 where user_id = 1;
Query OK, 1 row affected (0.01 sec)

select * from balances where user_id = 1;
+----+--------+---------+
| id | amount | user_id |
+----+--------+---------+
|  1 | 210000 |       1 |
+----+--------+---------+
1 row in set (0.00 sec)
```

トランザクションB開始。user_id = 1の残高を確認する

```SQL
-- Bのセッション
begin;

select * from balances where user_id = 1;
+----+--------+---------+
| id | amount | user_id |
+----+--------+---------+
|  1 | 210000 |       1 |
+----+--------+---------+

```

トランザクションBで、Aのコミットされていない変更を確認できた(ダーティリード)

### ノンリピータブルリード
A, Bのセッションのトランザクション分離レベルをREAD COMMITTEDに変更しておく

```SQL
set session transaction isolation level READ COMMITTED;
```

やること
トランザクションAで二回selectし、一回目と二回目の間にトランザクションBで残高を増やし、Aの二回のselect結果が異なっていることを確認する

手順

トランザクションAを開始し、一回目のselectを実行
```SQL

-- Aのセッション
begin;
select * from balances where user_id = 1;

+----+--------+---------+
| id | amount | user_id |
+----+--------+---------+
|  1 | 200000 |       1 |
+----+--------+---------+
```

トランザクションBを開始し、残高を増やす
```SQL
-- Bのセッション
begin;
update balances set amount = amount + 10000 where user_id = 1;

select * from balances where user_id = 1;
+----+--------+---------+
| id | amount | user_id |
+----+--------+---------+
|  1 | 210000 |       1 |
+----+--------+---------+

-- ここでAから口座を確認しても変わっていない(ダーティリードは起こらない)
commit;
```

トランザクションAからもう一度残高を確認
```SQL
-- Aのセッション
select * from balances where user_id = 1;
+----+--------+---------+
| id | amount | user_id |
+----+--------+---------+
|  1 | 210000 |       1 |
+----+--------+---------+
1 row in set (0.00 sec)
```

Bのコミット後の変更が参照でき、一回目の結果とは異なっていることが確認できた(ノンリピータブルリード)

### ファントムリード
A, Bのセッションのトランザクション分離レベルをREPEATABLE READに上げたいが、MySQLではMVCCによってREPEATABLE READではファントムリードは起こらない
なので、READ COMMITTEDのまま進む

```SQL
set session transaction isolation level READ COMMITTED;
```

やること

トランザクションAで総口座数を二回集計する。一回目と二回目の間にトランザクションBでinsert処理を行い、一回目と二回目の集計結果が異なることを確認

手順

トランザクションAを開始し口座の総数を取得(一回目)

```SQL
-- Aのセッション
begin;
select count(*) from balances;
+----------+
| count(*) |
+----------+
|        2 |
+----------+
```

トランザクションBを開始し、insert処理を行いコミット

```SQL
-- Bのセッション
begin;
insert into balances (amount, user_id)
values (200000, 3);

-- ここでのコミット前にAから口座の総数を確認しても変わっていない(ダーティリードは起こらない)
commit;
```

トランザクションAで口座の総数を取得(二回目)
```SQL
select count(*) from balances;
+----------+
| count(*) |
+----------+
|        3 |
+----------+
```

一回目と二回目で差があることが確認できた(ファントムリード)

## チケット販売の例

- このような状況では楽観ロックを利用するでしょうか？それとも悲観ロックを利用するでしょうか？
  - この例では滅多に多重予約が起きないので楽観ロックを使う


楽観ロックを用いた擬似コード
```TypeScript
// 画面から席の番号指定してシートを取得する
const seat = seatRepository.findEmptySeat(movieId, seatNumber)

seat.isPurchased = true

// is_purchasedというカラムがロックキーであることを想定
if (seatRepository.find(seat.id, movieId).isPurchased === true) {
  throw new Error('そのシートは既に購入されています！')
}

// シートを予約
seatRepository.save(seat)

// シート予約後に外部の決済APIを使い決済
// 決済はしたがシートは予約できなかったという状態を防ぐため、シートの予約が確定してから決済する
try {
  paymentAPIService.pay(fee)
} catch(error) {
  // シートを空き状態に戻す
  seat.isPurchased = false
  seatRepository.save(seat)

  throw new Error(`料金の支払いに失敗しました: ${error.message}`)
}
```

# クイズ

以下は銀行口座の振込の例です。トランザクションAで口座Xに振込を行う途中でトランザクションBが口座Xにアクセスします

1. トランザクションAを開始。口座Xの残高を取得する（残高: 10万円）
2. トランザクションAで口座Xに3万円振り込み（残高: 13万円）（まだコミットはしない）
3. トランザクションBを開始。口座Xの残高を取得する
4. トランザクションAをコミット
5. トランザクションBで再び口座Xの残高を取得する

## I

トランザクションBのセッションのトランザクション分離レベルがREAD-COMMITTEDだった場合、上記の3のタイミングでBが取得した口座の残高はいくらでしょうか？
理由も含めて教えてください

## Ⅱ

トランザクションBのセッションのトランザクション分離レベルがREAD-COMMITTEDだった場合、上記の5のタイミングでBが取得した口座の残高はいくらでしょうか？
理由も含めて教えてください

## Ⅲ

トランザクションBのセッションのトランザクション分離レベルがREPEATABLE-READだった場合、上記の5のタイミングでBが取得した口座の残高はいくらでしょうか？
理由も含めて教えてください
