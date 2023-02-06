# 1

## slackのようなサービスの論理設計を考える

以下の仕様を満たすようにしてください

- メッセージ
  - 誰が、どのチャネルに、いつ、どんな内容を投稿したのか分かること
- スレッドメッセージ
  - 誰が、どのメッセージに、いつ、どんな内容をスレッドとして投稿したのか分かること
- チャネル
  - そのチャネルに所属しているユーザにしか、メッセージ・スレッドメッセージが見えないこと
- ユーザ
  - ワークスペースに参加・脱退できること
  - チャネルに参加・脱退できること
- 横断機能
  - メッセージとスレッドメッセージを横断的に検索できること（例えば「hoge」と検索したら、この文字列を含むメッセージとスレッドメッセージを両方とも取得できること）
  - 参加していないチャネルのメッセージ・スレッドメッセージは検索できないこと

### 論理設計

```plantuml

@startuml

entity User {
  *id: number
  *mail_address: varchar
  *name: varchar
  *created_at: datetime
}

entity WorkspaceUsers {
  *workspace_id: number <<FK>>
  *user_id: number <<FK>>
}

entity Workspace {
  *id: number
  *name: varchar
  *author_id : number <<FK>>
  *created_at: datetime
}

entity Channel {
  *id: number
  *workspace_id: number <<FK>>
  *name: varchar
  *created_at: datetime
}

entity ChannelUsers {
  *channel_id: number <<FK>>
  *user_id : number <<FK>>
}

entity Message {
  *id: number
  *author_id: number <<FK>>
  *content: text
  *created_at: datetime
  *updated_at: datetime
}

entity ThreadMessage {
  *id: number
  *author_id: number <<FK>>
  *message_id: number <<FK>>
  *content: text
  *created_at: datetime
  *updated_at: datetime
}

@enduml

```

![UML](chat_tool_erd.png)
