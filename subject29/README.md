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

- ユーザーが参加、脱退できる
- 複数のチャネルを持つ

- WorkSpaces
  - id
  - name
  - author_id
  - created_at
  - updated_at

- WorkSpaceChannels
  - workspace_id
  - channel_id

- Channels
  - id
  - workspace_id
  - name
  - created_at
  - updated_at

- Users
  - id
  - mail_address
  - name
  - created_at

- WorkSpaceUsers
  - workspace_id
  - user_id

- ChannelUsers
  - channel_id
  - user_id

- Messages
  - id
  - author_id
  - content
  - created_at
  - updated_at

- ThreadMessages
  - id
  - author_id
  - message_id
  - content
  - created_at
  - updated_at
