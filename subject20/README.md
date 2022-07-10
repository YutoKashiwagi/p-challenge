## 1

### ビューとは

select文にaliasをつけられる機能のこと
よく使うselect文をビューとして作成しておくことで、実際にテーブルを作成せずにその結果をテーブルのように利用できるようになる

### ビューの用途、メリット

- SQLをシンプルにできる
  - よく使うSQLに対して、その結果を色々加工する処理などはビューを使うことでシンプルになる
- セキュリティが高まる
  - 権限ごとにビューを作成することで、本来見せたくない情報が露出することを防げる

### マテビューについて

結果をキャッシュできるビューのこと
ビューはselect結果のただのaliasであるのに比べ、マテビューは結果を実際のテーブルと同様に保存でき、保存期間内であれば結果を高速に呼び出せる
リアルタイム性が少ないかつ、頻繁に更新されないデータの呼び出しに向いている

## 2 

現在シニアエンジニアである従業員を表示する以下のクエリのビューを作成する

```SQL
select * from employees e natural join titles t where t.title = 'Senior Engineer' and t.to_date = '9999-01-01';
```

select count(e.gender), e.gender from employees e natural join titles t where t.title = 'Senior Engineer' and t.to_date = '9999-01-01';

ビューの作成
```SQL
create view senior_engineers as select * from employees e natural join titles t where t.title = 'Senior Engineer' and t.to_date = '9999-01-01';
```

### ビューを使った結果の絞り込みと、ビューを使わない結果の絞り込みでのパフォーマンスの違い

上のシニアエンジニアの中から、first_nameがZitaである従業員の数を性別ごとに取得してみる

#### ビューを使わない場合

```
mysql> select count(e.gender), e.gender from employees e natural join titles t where t.title = 'Senior Engineer' and t.to_date = '9999-01-01' and e.first_name = 'Zita' group by gender;
+-----------------+--------+
| count(e.gender) | gender |
+-----------------+--------+
|              48 | M      |
|              25 | F      |
+-----------------+--------+
2 rows in set (0.20 sec)
```

#### ビューを使う場合

```
mysql> select count(*), gender from senior_engineers where first_name = 'Zita' group by gender;
+----------+--------+
| count(*) | gender |
+----------+--------+
|       48 | M      |
|       25 | F      |
+----------+--------+
2 rows in set (0.19 sec)
```

パフォーマンスに違いはなかった
