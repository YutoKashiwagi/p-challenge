# 1

## 複合インデックスをわかりやすく説明

一つだけでなく、複数のカラムに設定することができるインデックス。
複数のカラムで絞り込むwhereを使うクエリでの絞り込み対象となるカラムに設定することで、そのクエリがインデックスの恩恵を受けることができる。

## 姓だけの検索、あるいは姓名を合わせた検索に対して複合インデックスを使う場合

```SQL

CREATE INDEX employees_name ON employees (first_name, last_name)

```

複合インデックスに指定するカラムには順番があり、先頭に指定したものから順にインデックスが走査される
この場合、first_nameのみでの絞り込み、またはfirst_nameとlast_nameのみで絞り込みの場合のみインデックスが利用されるため、姓(last_name)だけの検索ではindexが利用されない

なので、last_nameから順にインデックスを貼ると良い

```SQL

CREATE INDEX employees_name ON employees (last_name, first_name)

```


[参考](https://nishinatoshiharu.com/overview-multicolumn-indexes/)

# 2

## 参考
```
performance_schemaの使い方の参考記事
https://gihyo.jp/dev/serial/01/mysql-road-construction-news/0130
```

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

## 複合インデックスを使うクエリ三つ

### 1

```SQL

select * from employees where first_name = 'Georgi' and last_name = 'Wielonsky';

```

インデックス使用前
```
+----------+----------+---------------------------------------------------------------------------------+
| EVENT_ID | Duration | SQL_TEXT                                                                        |
+----------+----------+---------------------------------------------------------------------------------+
|      111 | 0.097260 | select * from employees where first_name = 'Georgi' and last_name = 'Wielonsky' |
+----------+----------+---------------------------------------------------------------------------------+

```

インデックス作成

```SQL
create index employees_full_name on employees (first_name, last_name)
```

インデックス使用後
```
+----------+----------+---------------------------------------------------------------------------------+
| EVENT_ID | Duration | SQL_TEXT                                                                        |
+----------+----------+---------------------------------------------------------------------------------+
|      167 | 0.000883 | select * from employees where first_name = 'Georgi' and last_name = 'Wielonsky' |
+----------+----------+---------------------------------------------------------------------------------+
```

約110倍もの差が出た

explain
```SQL
explain select * from employees where first_name = 'Georgi' and last_name = 'Wielonsky';
+----+-------------+-----------+------------+------+---------------------+---------------------+---------+-------------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys       | key                 | key_len | ref         | rows | filtered | Extra |
+----+-------------+-----------+------------+------+---------------------+---------------------+---------+-------------+------+----------+-------+
|  1 | SIMPLE      | employees | NULL       | ref  | employees_full_name | employees_full_name | 34      | const,const |    1 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+---------------------+---------------------+---------+-------------+------+----------+-------+

```

ちゃんとインデックスが使われている

### 2

```SQL

select * from employees where birth_date = '1953-09-02' and last_name = 'Gide';

```

インデックス使用前
```

SELECT EVENT_ID, TRUNCATE(TIMER_WAIT/1000000000000,6) as Duration, SQL_TEXT FROM performance_schema.events_statements_history_long WHERE SQL_TEXT = "select * from employees where birth_date = '1953-09-02' and last_name = 'Gide'";

+----------+----------+--------------------------------------------------------------------------------+
| EVENT_ID | Duration | SQL_TEXT                                                                       |
+----------+----------+--------------------------------------------------------------------------------+
|      471 | 0.092577 | select * from employees where birth_date = '1953-09-02' and last_name = 'Gide' |
+----------+----------+--------------------------------------------------------------------------------+
```

インデックス作成

```SQL
create index employees_birth_date_last_name on employees (birth_date, last_name);
```

インデックス使用後
```

SELECT EVENT_ID, TRUNCATE(TIMER_WAIT/1000000000000,6) as Duration, SQL_TEXT FROM performance_schema.events_statements_history_long WHERE SQL_TEXT = "select * from employees where birth_date = '1953-09-02' and last_name = 'Gide'";

+----------+----------+--------------------------------------------------------------------------------+
| EVENT_ID | Duration | SQL_TEXT                                                                       |
+----------+----------+--------------------------------------------------------------------------------+
|      471 | 0.092577 | select * from employees where birth_date = '1953-09-02' and last_name = 'Gide' |
|      566 | 0.000695 | select * from employees where birth_date = '1953-09-02' and last_name = 'Gide' |
+----------+----------+--------------------------------------------------------------------------------+

```

約133.2倍もの差が出た

explain
```SQL

 explain select * from employees where birth_date = '1953-09-02' and last_name = 'Gide';
+----+-------------+-----------+------------+------+--------------------------------+--------------------------------+---------+-------------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys                  | key                            | key_len | ref         | rows | filtered | Extra |
+----+-------------+-----------+------------+------+--------------------------------+--------------------------------+---------+-------------+------+----------+-------+
|  1 | SIMPLE      | employees | NULL       | ref  | employees_birth_date_last_name | employees_birth_date_last_name | 21      | const,const |    1 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+--------------------------------+--------------------------------+---------+-------------+------+----------+-------+

```

ちゃんと複合インデックスが使われている

### 3

カーディナリティの低いものから順に指定してみる

```SQL
select * from employees where gender = 'M' and hire_date = '1995-07-14';
```

インデックス使用前
```
SELECT EVENT_ID, TRUNCATE(TIMER_WAIT/1000000000000,6) as Duration, SQL_TEXT FROM performance_schema.events_statements_history_long WHERE SQL_TEXT = "select * from employees where gender = 'M' and hire_date = '1995-07-14'";
+----------+----------+-------------------------------------------------------------------------+
| EVENT_ID | Duration | SQL_TEXT                                                                |
+----------+----------+-------------------------------------------------------------------------+
|     1009 | 0.122225 | select * from employees where gender = 'M' and hire_date = '1995-07-14' |
+----------+----------+-------------------------------------------------------------------------+
```

インデックス作成

```SQL
create index employee_gender_hire_date on employees(gender, hire_date);
```

インデックス使用後
```
SELECT EVENT_ID, TRUNCATE(TIMER_WAIT/1000000000000,6) as Duration, SQL_TEXT FROM performance_schema.events_statements_history_long WHERE SQL_TEXT = "select * from employees where gender = 'M' and hire_date = '1995-07-14'";
+----------+----------+-------------------------------------------------------------------------+
| EVENT_ID | Duration | SQL_TEXT                                                                |
+----------+----------+-------------------------------------------------------------------------+
|     1097 | 0.001169 | select * from employees where gender = 'M' and hire_date = '1995-07-14' |
+----------+----------+-------------------------------------------------------------------------+
```

 104.5倍の差が出た

explain
```SQL
explain select * from employees where gender = 'M' and hire_date = '1995-07-14';

+----+-------------+-----------+------------+------+---------------------------+---------------------------+---------+-------------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys             | key                       | key_len | ref         | rows | filtered | Extra |
+----+-------------+-----------+------------+------+---------------------------+---------------------------+---------+-------------+------+----------+-------+
|  1 | SIMPLE      | employees | NULL       | ref  | employee_gender_hire_date | employee_gender_hire_date | 4       | const,const |   21 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+---------------------------+---------------------------+---------+-------------+------+----------+-------+
```

ちゃんとインデックスが使われている

## クイズ

- 1990年代に入社した男性従業員数を年ごとに集計してください
- last_nameがBennで始まる1990年台に入社した従業員数を集計してください
- 1950年代生まれかつ、1980年代に入社した、first_nameがGeorgeの社員数を集計してください
