import { NameApiService } from "../nameApiService"
import type { IHttpClient } from "../nameApiService"

const getMockedNameApiService = (firstName: string) => {
  const response = () => {
    return {
      data: {
        first_name: firstName
      }
    }
  }  
  const get = jest.fn((url: string) => {
    return new Promise((resolve) => {
      resolve(response())
    })
  })  
  const HttpClientMock = jest.fn<IHttpClient, any>().mockImplementation(() => {
    return {
      get
    }
  })
  const httpClient: IHttpClient = new HttpClientMock()
  return new NameApiService(httpClient)
}

describe('getFirstName', () => {
  test('5文字未満の場合、firstNameを返すこと', () => {
    const nameApiService = getMockedNameApiService("aaa")

    // アサーション
    return nameApiService.getFirstName().then(fetchedName => {
      expect(fetchedName).toEqual("aaa")
    })
  })

  test('5文字以上の場合、例外が発生すること', () => {
    const nameApiService = getMockedNameApiService("aaaaa")

    // アサーション
    return nameApiService.getFirstName().catch(error => {
      expect(error.message).toMatch("firstName is too long!")
    })
  })
})
