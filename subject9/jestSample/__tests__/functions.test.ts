import { asyncSumOfArray, sumOfArray, asyncSumOfArraySometimesZero, getFirstNameThrowIfLong } from "../functions"
import { DatabaseMock } from "../util"
import { NameApiService } from '../nameApiService'

describe('sumOfArray', () => {
  test('配列内の数値の合計を取得できること', () => {
    expect(sumOfArray([1, 2, 3, 4])).toEqual(10)
  })

  test('配列が空の場合、0が返ること', () => {
    expect(sumOfArray([])).toEqual(0)
  })
})

describe('asyncSumOfArray', () => {
  test('配列内の数値の合計を取得できること', () => {
    return asyncSumOfArray([1, 2, 3, 4]).then(sum => {
      expect(sum).toEqual(10)
    })
  })

  test('配列が空の場合、0が返ること', () => {
    return asyncSumOfArray([]).then(sum => {
      expect(sum).toEqual(0)
    })
  })

  // 型が異なる場合、CIで落ちるはずなのでコンパイルエラーのテストは書かない
})

describe('asyncSumOfArraySometimesZero', () => {
  const save = jest.fn((numbers: number[]) => {})

  const DBMock = jest.fn<DatabaseMock, any>().mockImplementation(() => {
    return {
      save: save,
    }
  })
  const database = new DBMock()

  test('配列内の数値をsaveし、数値の合計を取得できること', () => {
    return asyncSumOfArraySometimesZero([1, 2, 3, 4], database).then(sum => {
      expect(save.mock.calls.length).toBe(1) // 呼び出し回数の確認
      expect(save.mock.calls[0][0]).toEqual([1, 2, 3, 4]) // 引数のチェック
      expect(sum).toEqual(10)
    })
  })

  test('配列が空の場合、0が返ること', () => {
    expect.assertions(1)
    return asyncSumOfArraySometimesZero([], database).then(sum => {
      expect(sum).toEqual(0)
    })
  })
})

jest.mock('../nameApiService')
const nameApiServiceMock = NameApiService as jest.Mock

describe('getFirstNameThrowIfLong', () => {
  const maxNameLength = 3
  
  nameApiServiceMock.mockImplementationOnce(() => {
    return {
      getFirstName() {
        return new Promise(resolve => resolve('aaa'))
      }
    }
  })
  test('maxNameLength以下の文字数のFirstNameの場合、FirstNameを取得できること', () => {
    return getFirstNameThrowIfLong(maxNameLength, new nameApiServiceMock).then(firstName => {
      expect(firstName).toEqual("aaa")
    })
  })

  nameApiServiceMock.mockImplementationOnce(() => {
    return {
      getFirstName() {
        return new Promise(resolve => resolve('aaaaaa'))
      }
    }
  })
  test('最大文字数を超過した場合、エラーが発生すること', () => {
    return getFirstNameThrowIfLong(maxNameLength, new nameApiServiceMock()).catch(error => {
      expect(error.message).toMatch("first_name too long")
    })
  })
})
