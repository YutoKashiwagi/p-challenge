class User {
  id: number

  constructor(id: number) {
      this.id = id
  }
}

// 決済の基底クラス。決済方法を追加する時はこのインターフェースを継承したクラスを新たに追加する
interface PaymentClient {
  pay(user: User, amount: number): void
}

// クレジットカードで決済を行う、PaymentClientのInterfaceを継承したクラス
class CreditCardPaymentClient implements PaymentClient {
  constructor() {
      // 初期化処理
  }

  pay(user: User, amount: number) {
      // 購入処理
      console.log('クレジットカードで決済しました')
  }
}

// 何らかのAPIで決済を行う、PaymentClientのInterfaceを継承したクラス
class SomePaymentAPIClient implements PaymentClient {
  constructor() {
      // 初期化処理
  }

  pay(user: User, amount: number) {
      // 購入処理
      console.log('APIで決済しました')
  }
}

// PaymentClientを作成するクラス。新しい決済方法を追加する時はここに分岐を追加する
type PaymentType = 'credit' | 'somePaymentAPI'
class PaymentClientFactory {
  static create(paymentType: PaymentType): PaymentClient {
      switch (paymentType) {
      case 'credit':
          new CreditCardPaymentClient()
      case 'somePaymentAPI':
          new SomePaymentAPIClient()
      default:
          throw '存在しない決済方法です'
      }

  }
}

// 決済を行うサービスクラス。新しい決済方法を追加しても、ここに修正は入らない
class PaymentService {
  private user: User
  private paymentClient: PaymentClient

  constructor(user: User, paymentType: PaymentType) {
      this.user = user
      this.paymentClient = PaymentClientFactory.create(paymentType)
  }

  pay(amount: number) {
      this.paymentClient.pay(this.user, amount)
  }
}

// クレカで購入する場合
new PaymentService(new User(1), 'credit').pay(10000)
// APIで購入する場合
new PaymentService(new User(2), 'somePaymentAPI').pay(10000)
