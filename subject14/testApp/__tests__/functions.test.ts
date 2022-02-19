import { add, divide, multiply, subtract } from "../functions"

describe('multiply', () => {
  // 計算のテスト
  it('掛け算ができること', () => {
    expect(multiply(...[1, 1, 1])).toBe(1)
    expect(multiply(...[1, 2, 3])).toBe(6)
    expect(multiply(...[1, 2, 0])).toBe(0)
  })

  // 引数のテスト
  it('引数は1個以上必要であること', () => {
    expect(multiply(...[0])).toBe(0)
    expect(() => { multiply(...[]) }).toThrow('引数は一つ以上指定してください')
  })
  it('引数が30個以下でなければいけないこと', () => {
    expect(multiply(...Array(30).fill(1))).toBe(1)
    expect(() => { multiply(...Array(31).fill(1)) }).toThrow('引数が多すぎます')
  })

  // 計算結果のテスト
  it('計算結果が1000より大きい場合、計算できないこと', () => {
    expect(multiply(...[100, 10])).toBe(1000)
    expect(() => { multiply(...[1001, 1]) }).toThrow('big big number')
  })
})

describe('add', () => {
  // 計算のテスト
  it('足算ができること', () => {
    expect(add(...[3, 10, 3])).toBe(16)
    expect(add(...[3.1, 10.1, 3.1])).toBe(16.3)
  })

  // 引数
  it('引数は1個以上必要であること', () => {
    expect(() => { add(...[])}).toThrow('引数は一つ以上指定してください')
    expect(add(...[3])).toBe(3)
  })
  it('引数が30個以下でなければいけないこと', () => {
    expect(add(...Array(30).fill(1))).toBe(30)
    expect(() => { add(...Array(31).fill(1)) }).toThrow('引数が多すぎます')
  })

  // 計算結果
  it('計算結果は1000以下でなければいけないこと', () => {
    expect(add(...Array(10).fill(100))).toBe(1000)
    expect(() => {
      const overThousand = [1000, 1]
      add(...overThousand)
    }).toThrow('too big')
  })
})

describe('subtract', () => {
  // 計算のテスト
  it('引き算できること', () => {
    expect(subtract(...[10])).toBe(10)
    expect(subtract(...[10, 1])).toBe(9)
    expect(subtract(...[10, 1, 1])).toBe(8)
  })

  // 引数
  it('引数は1個以上必要であること', () => {
    expect(() => { subtract(...[])}).toThrow('引数は一つ以上指定してください')
    expect((subtract(...[3]))).toBe(3)
  })
  it('引数が30個以下でなければいけないこと', () => {
    // 引数が30個の場合
    // 30 - (1 * 29) = 1を計算する
    const args: number[] = Array(29).fill(1)
    args.unshift(30)
    expect(subtract(...args)).toBe(1)

    expect(() => { subtract(...Array(31).fill(1)) }).toThrow('引数が多すぎます')
  })

  // 計算結果
  it('計算結果がマイナスになる場合、計算できないこと', () => {
    expect(() => { subtract(...[1, 2]) }).toThrow('negative number')
  })
})

describe('divide', () => {
  describe('計算', () => {
    it('割り算できること', () => {
      expect(divide(...[4, 2])).toBe(2)
      expect(divide(...[4, 2, 1])).toBe(2)
      expect(divide(...[0, 1, 1])).toBe(0)
    })
    it('0で割るとエラーになること', () => {
      expect(() => { divide(...[1, 0]) }).toThrow('zero division error')
    })
  })

  describe('引数', () => {
    it('引数は1個以上必要であること', () => {
      expect(divide(...[2])).toBe(2)
      expect(() => { divide(...[]) }).toThrow('引数は一つ以上指定してください')
    })
    it('引数が30個以下でなければいけないこと', () => {
      expect(divide(...Array(30).fill(1))).toBe(1)
      expect(() => { divide(...Array(31).fill(1)) }).toThrow('引数が多すぎます')
    })
  })
})
