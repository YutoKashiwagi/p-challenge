## インデックスの仕組みをわかりやすく説明して

書籍の索引と同じように、どの行がどの場所にあるかを保持したデータのこと。検索に必要な情報をあらかじめテーブルから抜き出しておくことで、高速に検索できる

selectを実行した時、インデックスがない場合は条件にあうレコードがあるかテーブルの先頭から最後まで全て調べることになる(シーケンシャルスキャン)。これはテーブルの大部分を抜き出す検索には向いているが、テーブルの中のごく少数を特定する検索するには無駄が多い

インデックスがある場合は、条件にあうレコードがあるかインデックスのデータの中で調べる（インデックススキャン）。インデックスはテーブルのデータと比べて容量も小さいため、シーケンシャルスキャンと比べて非常に速い

## 無闇にインデックスを貼る前にslow query logを調べるのは何故か

indexを貼るたびにそのテーブルのinsert処理は重くなるため、無闇にindexを追加してはならない。遅いクエリを特定し、そのクエリを高速化するためにインデックスが有効である場合にインデックスを貼ることを検討するのが望ましい

## カーディナリティとは?
値の種類の多さのこと。値の種類が多いほどカーディナリティが高くなる。例えばユーザー名カラムなどはカーディナリティが高く、性別カラムなどは低い

カーディナリティが高いカラムにインデックスを貼ると効果的

## カバリングインデックス

テーブルにアクセスせず、インデックススキャンのみでクエリが終了すること。テーブルアクセスと比べて非常に早いが、whereなどでインデックス外のカラムにアクセスするとカバリングインデックスにならない

## where句を一つだけ含むクエリ三つの実行時間計測

### 1
`select * from employees where gender = 'M'`
- カーディナリティ低め

- パフォーマンス調査用クエリ
```SQL
SELECT EVENT_ID, TRUNCATE(TIMER_WAIT/1000000000000,6) as Duration, SQL_TEXT
FROM performance_schema.events_statements_history_long
WHERE SQL_TEXT = "select * from employees where gender = 'M'"
ORDER BY EVENT_ID DESC;
```

- インデックス作成
`create index employees_gender_idx on employees(gender);`

#### インデックスを貼る前のパフォーマンス
```

+----------+----------+--------------------------------------------+
| EVENT_ID | Duration | SQL_TEXT                                   |
+----------+----------+--------------------------------------------+
|      305 | 0.331594 | select * from employees where gender = 'M' |
+----------+----------+--------------------------------------------+

```

#### インデックスを貼ったあとのパフォーマンス

```

+----------+----------+--------------------------------------------+
| EVENT_ID | Duration | SQL_TEXT                                   |
+----------+----------+--------------------------------------------+
|     1152 | 0.258433 | select * from employees where gender = 'M' |
+----------+----------+--------------------------------------------+

```

貼る前とあとでは1.3倍ほど速度の差が出た

### explain結果

```

mysql> explain select * from employees where gender = 'M';
+----+-------------+-----------+------------+------+----------------------+----------------------+---------+-------+--------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys        | key                  | key_len | ref   | rows   | filtered | Extra |
+----+-------------+-----------+------------+------+----------------------+----------------------+---------+-------+--------+----------+-------+
|  1 | SIMPLE      | employees | NULL       | ref  | employees_gender_idx | employees_gender_idx | 1       | const | 149534 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+----------------------+----------------------+---------+-------+--------+----------+-------+

```

### 2
`select * from employees where first_name = 'Anneke';`

- パフォーマンス調査用クエリ
```SQL
SELECT EVENT_ID, TRUNCATE(TIMER_WAIT/1000000000000,6) as Duration, SQL_TEXT
FROM performance_schema.events_statements_history_long
WHERE SQL_TEXT = "select * from employees where first_name = 'Anneke'"
ORDER BY EVENT_ID DESC;
```

- インデックス作成
`create index employees_first_name_idx on employees(first_name);`

#### インデックスを貼る前のパフォーマンス
```

+----------+----------+-----------------------------------------------------+
| EVENT_ID | Duration | SQL_TEXT                                            |
+----------+----------+-----------------------------------------------------+
|     1248 | 0.092040 | select * from employees where first_name = 'Anneke' |
+----------+----------+-----------------------------------------------------+

```

#### インデックスを貼ったあとのパフォーマンス

```

+----------+----------+-----------------------------------------------------+
| EVENT_ID | Duration | SQL_TEXT                                            |
+----------+----------+-----------------------------------------------------+
|     1306 | 0.012302 | select * from employees where first_name = 'Anneke' |
+----------+----------+-----------------------------------------------------+
1 row in set (0.00 sec)

```

### explain結果

```

mysql> explain select * from employees where first_name = 'Anneke';
+----+-------------+-----------+------------+------+--------------------------+--------------------------+---------+-------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys            | key                      | key_len | ref   | rows | filtered | Extra |
+----+-------------+-----------+------------+------+--------------------------+--------------------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | employees | NULL       | ref  | employees_first_name_idx | employees_first_name_idx | 16      | const |  225 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+--------------------------+--------------------------+---------+-------+------+----------+-------+

```

### 3
``

- パフォーマンス調査用クエリ
`select * from employees where birth_date = '1952-07-26';`


```SQL
SELECT EVENT_ID, TRUNCATE(TIMER_WAIT/1000000000000,6) as Duration, SQL_TEXT
FROM performance_schema.events_statements_history_long
WHERE SQL_TEXT = "select * from employees where birth_date = '1952-07-26'"
ORDER BY EVENT_ID DESC;
```

- インデックス作成
`create index employees_birth_date_idx on employees(birth_date);`

#### インデックスを貼る前のパフォーマンス
```

+----------+----------+---------------------------------------------------------+
| EVENT_ID | Duration | SQL_TEXT                                                |
+----------+----------+---------------------------------------------------------+
|     1352 | 0.116518 | select * from employees where birth_date = '1952-07-26' |
+----------+----------+---------------------------------------------------------+

```

#### インデックスを貼ったあとのパフォーマンス

```

+----------+----------+---------------------------------------------------------+
| EVENT_ID | Duration | SQL_TEXT                                                |
+----------+----------+---------------------------------------------------------+
|     1428 | 0.009130 | select * from employees where birth_date = '1952-07-26' |
+----------+----------+---------------------------------------------------------+

```

インデックス貼る前とあとで約12.8倍の差がでた。カーディナリティが低いgenderの場合よりもインデックスの効果が高い

### explain結果

```

mysql> explain select * from employees where birth_date = '1952-07-26';
+----+-------------+-----------+------------+------+--------------------------+--------------------------+---------+-------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys            | key                      | key_len | ref   | rows | filtered | Extra |
+----+-------------+-----------+------------+------+--------------------------+--------------------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | employees | NULL       | ref  | employees_birth_date_idx | employees_birth_date_idx | 3       | const |   83 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+--------------------------+--------------------------+---------+-------+------+----------+-------+

```


performance_schemaの使い方の参考記事
https://gihyo.jp/dev/serial/01/mysql-road-construction-news/0130

performance_schemaでクエリの監視を行う設定
```SQL
UPDATE performance_schema.setup_instruments SET ENABLED = 'YES', TIMED = 'YES' WHERE NAME LIKE '%statement/%';
UPDATE performance_schema.setup_instruments SET ENABLED = 'YES', TIMED = 'YES' WHERE NAME LIKE '%stage/%';

UPDATE performance_schema.setup_consumers SET ENABLED = 'YES' WHERE NAME LIKE '%events_statements_%';
UPDATE performance_schema.setup_consumers SET ENABLED = 'YES' WHERE NAME LIKE '%events_stages_%';
```

performance_schemaで特定のクエリのパフォーマンスを調べる（TIME_WAITはps表記なので、sに変換）
```SQL
SELECT EVENT_ID, TRUNCATE(TIMER_WAIT/1000000000000,6) as Duration, SQL_TEXT
FROM performance_schema.events_statements_history_long WHERE SQL_TEXT = '調べたいクエリ';
```

## indexを貼る前後でのinsert処理にかかる時間

employeesテーブルで検証する

使うinsert処理
```SQL
insert into employees (emp_no, birth_date, first_name, last_name, gender, hire_date) values (500000, '1995-07-14', 'Yuto', 'Kashiwagi', 'M', '2021-07-14');
```

### indexを貼っている状態

```

mysql> show index from employees;
+-----------+------------+--------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name                 | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+--------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY                  |            1 | emp_no      | A         |      299069 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | employees_gender_idx     |            1 | gender      | A         |           1 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | employees_first_name_idx |            1 | first_name  | A         |        1266 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | employees_birth_date_idx |            1 | birth_date  | A         |        4747 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+--------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+

```

処理時間: 0.021441 sec

### indexを貼っていない状態

```

mysql> show index from employees;
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY  |            1 | emp_no      | A         |      299069 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+

```

処理時間: 0.004606 sec

### 結果

indexを貼る前後でinsert処理時間に約4.5倍の差があった。

#### insert遅くなった理由

insert処理はindexの恩恵を受けられないため、indexによる高速化の恩恵をうけることはできない。またinsertするたびにindexに新しいレコードの情報を追加する必要があり、このインデックス作成処理は重いため、indexを追加するたびにinsertはどんどん遅くなる

#### deleteとindexの関係

deleteは
- whereによる対象行の絞り込み
- 削除処理
の2ステップからなり、前者はindexによる高速化の恩恵を受けるが、後者はindexの数に比例して遅くなる

なので削除したい行が大量にあるのであればindexを削除した方が早く、少なければindexを貼っていた方が早くなる

## クイズ

- 従業員の男女比
- 入社年度ごとの従業員数
- 今日(`current_date()`)が誕生日の従業員一覧

## 参考
- indexとinsert, deleteの関係について
  - https://use-the-index-luke.com/ja/sql/dml/insert
