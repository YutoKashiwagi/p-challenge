# 1

以下のような設計だとどのような問題が生じるか？

```
TABLE Post {

id: varchar

content: varchar

tag1: varchar

tag2: varchar

tag3: varchar

}



TABLE Tag {

id: varchar

content: varchar

}
```

- Postに付与できるタグの数を変更するたびにマイグレーションが必要になる
- 人気のタグなどを集計する時、全てのPostテーブルを見にいかなければいけない

# 2 

課題22の修正後と同じ設計にする
