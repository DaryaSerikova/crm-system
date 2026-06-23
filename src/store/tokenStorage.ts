export class AccessTokenManager {
  #accessToken: string | null = null;

  public get(): string | null {
    return this.#accessToken;
  }

  public set(token: string): void {
    this.#accessToken = token;
  }

  public clear(): void {
    this.#accessToken = null;
  }

}

export const accessTokenManager = new AccessTokenManager();

// class TokenManager {
//   private accessToken: string| null = null;

//   public get token() {
//     return this.accessToken;
//   }

//   public set token(token: string) {
//     this.accessToken = token;
//   }

//   public clearAccessToken() {
//     this.accessToken = null;
//   }
// }