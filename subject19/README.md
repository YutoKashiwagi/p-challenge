## NULLを含む計算結果

- NULL = 0
  - 何もヒットしない
- NULL = NULL
  - 何もヒットしない
- NULL <> NULL
  - 何もヒットしない
- NULL AND TRUE
  - 何もヒットしない
- NULL AND FALSE
  - 何もヒットしない
- NULL OR TRUE
  - nullかtrueがヒット

## issues, assigneesテーブルの作り替え

### 元々の設計

assigneesテーブル
```
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | varchar(32) | NO   | PRI | NULL    |       |
+-------+-------------+------+-----+---------+-------+
```

issuesテーブル

```
+----------------+----------------+------+-----+---------+-------+
| Field          | Type           | Null | Key | Default | Extra |
+----------------+----------------+------+-----+---------+-------+
| id             | varchar(32)    | NO   | PRI | NULL    |       |
| text           | varchar(10000) | NO   |     | NULL    |       |
| assigned_to_id | varchar(32)    | YES  |     | NULL    |       |
+----------------+----------------+------+-----+---------+-------+
```

### issuesテーブルにnullを含まないように改修

```SQL
-- assigneeテーブルの書き換え。issueのidを加え、複合pkにする
alter table assignees add column issue_id varchar(32) not null;
alter table assignees add foreign key (issue_id) references issues(id);
alter table assignees drop primary key, add primary key(id, issue_id);

-- issuesテーブルの書き換え。assigned_to_idをなくす
alter table drop column assigned_to_id;
```

改善後

assigneesテーブル
```
+----------+-------------+------+-----+---------+-------+
| Field    | Type        | Null | Key | Default | Extra |
+----------+-------------+------+-----+---------+-------+
| id       | varchar(32) | NO   | PRI | NULL    |       |
| issue_id | varchar(32) | NO   | PRI | NULL    |       |
+----------+-------------+------+-----+---------+-------+
```

issuesテーブル

```
+-------+----------------+------+-----+---------+-------+
| Field | Type           | Null | Key | Default | Extra |
+-------+----------------+------+-----+---------+-------+
| id    | varchar(32)    | NO   | PRI | NULL    |       |
| text  | varchar(10000) | NO   |     | NULL    |       |
+-------+----------------+------+-----+---------+-------+
```

## クイズ

- 既存のテーブルに新しくnullableな値を追加したい時、以下の二通りがあるかと思います。どのような状況ならどちらを選ぶかの判断基準を教えてください
  - 該当テーブルにnullableで値を追加する
  - 該当テーブルに従属する新しいテーブルを作成する

- DBにおけるNULLの扱いを「集合」「値」という言葉を使って説明してください

- 既存のテーブルや新規テーブルにnullableなカラムを用意する時に気を付けていることがあれば教えてください
