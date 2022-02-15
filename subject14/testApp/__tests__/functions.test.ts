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
    expect(add(...[3])).toBe(3)
    expect(add(...[])).toBe(0)
  })
  it('引数が30個の場合、計算できること', () => {
    expect(add(...Array(30).fill(1))).toBe(30)
  })
  it('引数が31個以上の場合、計算できないこと', () => {
    expect(add(...Array(31).fill(1))).toBe('')
  })
  it.todo('引数が数字以外の場合、エラーになること')
  it.todo('計算結果が1000より大きい場合、計算できないこと')
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
