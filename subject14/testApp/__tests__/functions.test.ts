import { add } from "../functions"

describe('multiply', () => {
  // 計算結果のテスト
  // 引数のテスト
  it.todo('引数が一つの場合')
  it.todo('引数が30個の場合、計算できること')
  it.todo('引数が31個以上の場合、計算できないこと')
  it.todo('引数が数字以外の場合、エラーになること')
  it.todo('計算結果が1000より大きい場合、計算できないこと')
})

describe('add', () => {
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
    expect( () => { add(...Array(31).fill(1)) }).toThrow('引数が多すぎます')
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
  it.todo('引数が一つの場合')
  it.todo('引数が30個の場合、計算できること')
  it.todo('引数が31個以上の場合、計算できないこと')
  it.todo('引数が数字以外の場合、エラーになること')
  it.todo('計算結果がマイナスになる場合、計算できないこと')
})

describe('divide', () => {
  it.todo('引数が一つの場合')
  it.todo('引数が30個の場合、計算できること')
  it.todo('引数が31個以上の場合、計算できないこと')
  it.todo('引数が数字以外の場合、エラーになること')
  it.todo('少数点部分')
})
