# 1

```
TABLE Message {

id: varchar

parent_message_id: varchar

text: varchar

FOREIGN KEY (parent_message_id) REFERENCES Message(id)

}
```

隣接リスト(親ノードのIDを持つ形)の問題点

- 全ての階層を取得する処理が煩雑になる
  - 最も高頻度で行うであろう処理が煩雑
- insert, updateは容易だが、deleteが大変
  - 全ての階層を取得し、下から削除していく必要がある(外部キー制約のため)
- ノードの移動処理も大変

# 2

## 閉包テーブルを活用する形に修正する

```
TABLE Message {
  id: varchar
  text: varchar
}

TABLE MessagePath {
  ancester: varchar
  descendant: varchar
}
```

### 理由

メッセージの場合、CRUDのどれかに特化した形ではなく、どれもそこそこのパフォーマンスで行えるということが重要だと考えたため、最もバランスが良い閉包テーブルが良いと考えた
親ノードのIDがあれば、それ以下の階層を容易に取得できる

```SQL
select * from messages m join message_paths p on m.id = p.descendant where p.ancester = 親のID;
```

またノードの付け替えやinsert, deleteもそこそこ容易なため、メッセージのようなデータには最適と考えた

### その他の解決方法

#### 経路列挙(Path Enumeration)

```
TABLE Message {

id: varchar

path: varchar

text: varchar

FOREIGN KEY (parent_message_id) REFERENCES Message(id)

}
```

- parent_idの代わりに経路を入れるためのpathカラムを持つ
  - 例: 1/2/4

- ジェイウォークアンチパターンと同様の弱点がある
  - 参照整合性がDB側で担保できない
  - pathカラムの文字数制限により、深さ無制限というわけではない

参照整合性が担保できないのが気になった

#### 入れ子集合(Nested Set)

```
TABLE Message {

nsleft: varchar

nsright: varchar

path: varchar

text: varchar

FOREIGN KEY (parent_message_id) REFERENCES Message(id)

}
```

- 階層構造を円の包含関係と捉え直す
- 読み取りに特化したモデル。読み取りは非常に早いが、挿入、更新、削除が非常に面倒
- 削除されたノードの子孫は、その親の子という扱いになるのは便利

読み取りが早いのは魅力だが、Creaate, Update, Destroyがそこそこ行われるメッセージのようなデータには適さないと考えた

参考
- https://gihyo.jp/dev/serial/01/sql_academy2/000501
- https://www.netinbag.com/ja/internet/what-is-the-nested-set-model.html
