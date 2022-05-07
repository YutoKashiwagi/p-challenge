## スロークエリ監視設定

クエリタイムの設定

```SQL

-- クエリタイム確認
SHOW GLOBAL VARIABLES LIKE '%query_time%';

-- クエリタイムを0.1に設定
SET GLOBAL long_query_time = 0.1;

-- スロークエリーログ設定の確認
SHOW GLOBAL VARIABLES LIKE '%slow_query%';

-- スロークエリーログをとるように設定
SET GLOBAL slow_query_log = 'ON';
```

[参考1](https://qiita.com/bohebohechan/items/30103a0b79a520e991fa#%E3%82%B9%E3%83%AD%E3%83%BC%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%A8%E3%81%97%E3%81%A6%E3%81%AE%E5%88%A4%E5%AE%9A%E6%99%82%E9%96%93%E3%82%92%E8%A8%AD%E5%AE%9A)

[参考2](https://www.linux.org/threads/enable-the-slow-query-log-in-mysql.4321/)

### 実行時間が0.1s未満のクエリ

#### 1つめ

```SQL
select count(*) from employees where first_name = 'George';
+----------+
| count(*) |
+----------+
|      231 |
+----------+
1 row in set (0.01 sec)
```

0.01sのため、スロークエリログには入っていない

```
cat /var/lib/mysql/9bab821bcd78-slow.log

mysqld, Version: 5.7.24 (MySQL Community Server (GPL)). started with:
Tcp port: 3306  Unix socket: /var/run/mysqld/mysqld.sock
Time                 Id Command    Argument
```

#### 2つめ

```SQL

 select count(*) from employees where  last_name = 'Simmel';
+----------+
| count(*) |
+----------+
|      167 |
+----------+
1 row in set (0.07 sec)
```

同様に、スロークエリログには入ってない
```
cat /var/lib/mysql/9bab821bcd78-slow.log
mysqld, Version: 5.7.24 (MySQL Community Server (GPL)). started with:
Tcp port: 3306  Unix socket: /var/run/mysqld/mysqld.sock
Time                 Id Command    Argument
```

#### 3つめ

```SQL

select count(*) from employees where  last_name = 'Simmel';
+----------+
| count(*) |
+----------+
|      167 |
+----------+
1 row in set (0.07 sec)

```

同様に、スロークエリログに入っていない

### 実行時間が0.1s以上のクエリ

#### 一つ目

```SQL

select * from employees where birth_date = '1960-10-10';

69 rows in set (0.15 sec)
```

スロークエリログに入った
```
cat /var/lib/mysql/9bab821bcd78-slow.log

# Time: 2022-03-20T13:47:19.224974Z
# User@Host: root[root] @ localhost []  Id:     3
# Query_time: 0.149143  Lock_time: 0.000317 Rows_sent: 69  Rows_examined: 300026
SET timestamp=1647784039;
select * from employees where birth_date = '1960-10-10';
```

#### 二つ目

```SQL
select count(*) as count, date_format(hire_date, '%Y') as hire_year from employees where hire_date >= '1990-01-01' group by hire_year;
```

```
# Time: 2022-03-20T13:52:44.800163Z
# User@Host: root[root] @ localhost []  Id:     3
# Query_time: 0.159371  Lock_time: 0.000158 Rows_sent: 12  Rows_examined: 300050
SET timestamp=1647784364;
select count(*) as count, date_format(hire_date, '%Y') as hire_year from employees where hire_date >= '1990-01-01' group by hire_year;
```

### 三つ目

現在シニアエンジニアである従業員数

```SQL
select count(*) from employees e natural join titles t where t.title = 'Senior Engineer' and t.to_date = '9999-01-01';
```

```
# Time: 2022-03-20T13:59:23.563847Z
# User@Host: root[root] @ localhost []  Id:     3
# Query_time: 0.359063  Lock_time: 0.000523 Rows_sent: 1  Rows_examined: 529247
SET timestamp=1647784763;
select count(*) from employees e natural join titles t where t.title = 'Senior Engineer' and t.to_date = '9999-01-01';
```

## mysqldumpslowコマンド

```

Usage: mysqldumpslow [ OPTS... ] [ LOGS... ]

Parse and summarize the MySQL slow query log. Options are

  --verbose    verbose
  --debug      debug
  --help       write this text to standard output

  -v           verbose
  -d           debug
  -s ORDER     what to sort by (al, at, ar, c, l, r, t), 'at' is default
                al: average lock time
                ar: average rows sent
                at: average query time
                 c: count
                 l: lock time
                 r: rows sent
                 t: query time
  -r           reverse the sort order (largest last instead of first)
  -t NUM       just show the top n queries
  -a           don't abstract all numbers to N and strings to 'S'
  -n NUM       abstract numbers with at least n digits within names
  -g PATTERN   grep: only consider stmts that include this string
  -h HOSTNAME  hostname of db server for *-slow.log filename (can be wildcard),
               default is '*', i.e. match all
  -i NAME      name of server instance (if using mysql.server startup script)
  -l           don't subtract lock time from total time

```

- 最も頻度高くスロークエリに現れるクエリ

```bash
mysqldumpslow -s c -t 1 クエリログのパス
```

- 実行時間が最も長いクエリ
```bash
# -s atで平均実行時間が長い順で絞り込み
# -s tだと実行時間順にならなかった
mysqldumpslow -s at -t 1 パス
```
- ロック時間が最も長いクエリ

```bash
# -s alで平均ロック時間の長い順で絞りこみ
mysqldumpslow -s al -t 1 パス
```

## スロークエリ改善

### 最も頻度高くスロークエリに現れるクエリ

以下のクエリ（1990年以降に入社した従業員数を年ごとに集計）

```SQL
select count(*) as count, date_format(hire_date, '%Y') as hire_year from employees where hire_date >= '1990-01-01' group by hire_year
```

hire_dateカラムにインデックスを貼ると、0.03秒ぐらいは早くなった。countで何万件もの結果を返しているので、インデックスではそれほど早くならなかった

### 最も実行時間が長いクエリ

以下のクエリ（現在シニアエンジニアである従業員数）

```SQL
select count(*) from employees e natural join titles t where t.title = 'Senior Engineer' and t.to_date = '9999-01-01';
```

集計はtitlesテーブルだけで済むので、ジョインをやめてインデックスを追加した

```SQL
-- 改善後のクエリ
select count(*) from titles where title = 'Senior Engineer' and to_date = '9999-01-01';

-- 貼ったインデックス
create index titles_to_date_titles_index on titles(to_date, title)
```

0.3sぐらいかかっていたが、0.03sぐらいに改善された
titlesはカーディナリティが低いのでto_dateだけにインデックスを貼れば良くない？と思ってto_dateだけにしてみたところ、実行時間は0.07sぐらいかかった。このクエリだけ最適化するなら複合インデックスを貼った方が速かった

## 質問

### limit1なのに遅くなる場合

`limit n, m`とした場合、先頭からn+m件取得してからn件捨てるという処理になるため、nが多いと結局n件取得しているのと変わらず、時間はかかってしまう

インデックスを利用したソートができると早くなる場合がある

order byで指定するカラムにインデックスを貼ったり、order by, whereで指定するカラムに複合インデックスを使うなど

### JOIN ON で絞るのと、JOIN WHEREで絞る場合の違い

内部結合の場合は結果に違いがないが、外部結合の場合は違いが出る

JOIN WHEREの場合はONの条件で結合した後に全ての組み合わせの中からWHEREで絞り込むが、JOIN ONの場合は結合時点で条件に合致しないものは補集合扱いになる
内部結合の場合は補集合部分は捨てられるので、同じ条件をJOIN ON、JOIN WHEREのどちらで指定しても結果に違いはない
外部結合の場合はJOIN ONで条件を指定すると補集合部分も取得できるという点で結果に違いが出る

## スロークエリに関するクイズ

- スロークエリ改善の経験があれば、どんなクエリをどのように改善したか教えてください
- 開発チームがスロークエリに気づきやすくするための仕組みとしてはどのようなものがありそうでしょうか？一つ以上教えてください
- アプリケーションの設計観点のクイズです。DBへのアクセスをRepositoryクラスを経由して行うRepositoryパターンと、ReadとWriteでクラス、モジュールを分けた設計(CQRS)ではどちらの方がスロークエリ改善を行いやすいでしょうか？理由も含めて教えてください
  - [参考](https://little-hands.hatenablog.com/entry/2019/12/02/cqrs)
