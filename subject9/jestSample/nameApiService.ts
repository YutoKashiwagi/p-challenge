export interface IHttpClient {
  get: (url: string) => Promise<any>
}

export class NameApiService {
  private MAX_LENGTH = 4;
  private httpClient: IHttpClient
  public constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  public async getFirstName(): Promise<string> {
    const { data } = await this.httpClient.get(
      "https://random-data-api.com/api/name/random_name"
    );
    const firstName = data.first_name as string;

    if (firstName.length > this.MAX_LENGTH) {
      throw new Error("firstName is too long!");
    }

    return firstName;
  }
}
