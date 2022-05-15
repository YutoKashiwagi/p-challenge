# 1: SOLID原則を簡潔に説明

- S: 単一責任の原則
  - 「変更する理由が一つになるように設計すべき」という原則。モジュールを作成する時、ここに修正が入るのはどんな時か？ということを考えた時、その理由が一つだけになるように設計すると良い
    - SOLID原則の中で一番大事だと思う
    - 「一つのことをうまくやる」という意味ではないことに注意

- O: オープン・クローズドの原則
  - 変更に対しては閉じていて、拡張に対してはオープンにすべきという原則。既存のコードを変更するのではなく、拡張することで機能追加できるようにしておけという意味
  - モジュールを適切に分割しておくことで、変更による影響を最小限に抑える

- L: リスコフの置換原則
  - インターフェースと実装に関する原則。インターフェースに準拠した実装を行うことで、実装部分は差し替えが可能になる

- I: インターフェース分離の原則
  - 実装ではなく、インターフェースに依存するようにせよという原則
    - 実装の詳細を変更した時、使う側がその変更の影響を受けないように設計すると良い

- D: 依存性逆転の法則
  - 抽象クラスと具象クラスでは、具象クラスの方が変更されやすいので具象→抽象の方向に依存関係を作るように設計すべきという法則

# 単一責任の原則(SRP)と、単純にモジュールを細かく分割することの違い

モジュールを細かく分割すると凝集度が上がるが、認知負荷が高まるトレードオフがある

単純にモジュールを細かく分割すると、無秩序に処理が分散する可能性があり、認知負荷が高まる

単一責任の原則は、変更される理由が一つになるように設計をすることで、結果的にまとまりのある単位でモジュールが分割される

なのでSRPに基づいて分割されたモジュールは単純に細かく分割された結果と比べ意味のあるまとまりになっており、認知負荷が低く、変更に強いと言える

# Open-Closed-Principleの実例

# リスコフの置換原則に違反した場合、どのような不都合が生じるでしょうか？

- インターフェースを使う側が、その実装の詳細を気にしなければいけなくなる
- 実装を差し替える際、使う側もその影響を受けて修正が必要になる

# インターフェースを用いる事で、設計上どのようなメリットがあるでしょうか？

- 直接実装の詳細に依存した場合と比べ、その詳細の変更による影響を受けにくくなり、修正コストが低くなる

# DIPが必要になる時

- 実装の詳細が頻繁に変更される場合など
- 実装の詳細が外部のライブラリなど、自社で制御することが難しいモジュールに依存している場合など

# デメテルの法則

- デメテルの法則とは？
  - 直接依存しているモジュール以外の知識(どんなメソッド、フィールドがあるかなど)は最小限に抑えるべきという原則
    - `user.details.profile.images.first`みたいに、チェーンが何度も繋がるのは違反のサイン


以下のコードはデメテルの法則を守っているか？

```TypeScript

class Purchase {
  private _userId: string
  private _productId: string
  constructor(userId: string, productId: string) {
      this._userId = userId
      this._productId = productId
  }

  public get userId() {
      return this._userId
  }
  public set userId(id) {
      this._userId = id
  }
  public get productId() {
      return this._productId
  }
  public set productId(id) {
      this._productId = id
  }
}

```

これだとアクセサを省略しただけなので、デメテルの法則を守っているとは言えない
外部に晒す必要のないフィールドはアクセスできないように制御しないと意味がない

# 商品購入のコード例

「特定の商品は1人につき年間1つまでしか買えない」といった仕様を実装した以下のコードの問題点

```TypeScript

interface Purchase {
  userId: string
  productId: string
  transaction: {
    succeeded: true
    completedAt: Date
  }
}

interface PaymentRecordRepo {
  getPurchasesBy: (userId: string) => Purchase[]
}

class PurchaseService {
  public constructor(private paymentRecordRepo: PaymentRecordRepo) {}

  public purchase(userId: string, productId: string) {
    const allPurchases = this.paymentRecordRepo.getPurchasesBy(userId)
    const pastPurchase = allPurchases.find((p) => p.productId === productId && p.transaction.succeeded)
    if (pastPurchase) {
      throw new Error('この商品はおひとりさま一品限定です！')
    }

    // 購入手続きに進む
  }
}

```

- 問題点
  - 年間の一つまでではなく、過去に購入履歴があった場合購入できないというコードになっている
  - ユーザーの全ての注文を取得しているため、時間がかかる
  - 年間一つまでしか購入できないという重要なビジネスロジックが購入手続きの中にベタ書きされている

- 改善案
  - `PaymentRecordRepo#getPurchasesBy`に期間を指定して取得できるようにする
  - Purchaseのコレクションオブジェクトを作成し、その中に一年以内にその商品を購入したか？というロジックを持たせるようにする

# Companyクラスのコード例

https://www.typescriptlang.org/play?#code/MYGwhgzhAEAKCmAnCB7AdtA3gWAFDQOgAcBXAIxAEtho0wBbeALmggBdFK0BzPQ48lRrswiAOopEAay7cAgmxYARMG3h9CwdO0QlgbSQAo6jFjtkAaVm1FsJ02QuWr4ASiwb+BNgAtKEADoTeGgAXloGdXwvbz9AkXFJGR4FMOtbe2T5Nk9oAF88Atw8UEgYAGEUeiIwNABPD2iCUgpqYngUIhBmOCRUNABtAF1crTQdPQNEQyIOrp6EZHRh9xwmr19-ANnO7rSd+dyiopLtNmgtatqG8LR4AHdoSqv6wwG7x8X+wwByMB+rB9oCo1L8AEwABjBAEYALQQuEIn6uVyAh69JZoX5kAG0dEg+DgqGIuHQ5GuIauU7jc4AM0oyDYX3QaUuNXq2zm3QGEJGxVwAHoBdBAKrygEiGQDSDIA7BkAtwyADoZAMMMgHqGQDWDIB-eUAFK6ATQZANEMgH0GQCBDIBABmZGDkUsAJ0qATaVANGpgGnNQCnpoAkhkAa8qAKIZAF+KWup7GgABMXGl6YzTQEEplHDl+ULoIBVBkAfgyANQZ44ArBnlysA5gyawDqDIAzBkAIgw6lMSjOAEqjAMYMucAL2aABtM89n44AxBjwAbUYfgbAAYiQQCAAJrwUSGaEQ0dU3DB9ih4JpH70FB+yj0+B+iKMH54H0oboBEAobiGNnXdwxo-1KWAWjkVYBqFXjgBiGAt603Qc3W+0OwAyDIBITUA8QyVhuNoAgP94EAA

- 問題点
  - Companyクラスの外側から任意のPersonインスタンスを取得して書き換えられる
- 解決策
  - Companyクラスのpeopleをプライベートにし、不用意に外部に公開しない
    - Companyクラスの外側からpeopleに対して行いたい操作をメソッドとして実装するだけにとどめる（tell don't ask）
