export interface ImgurClientOptions {
  clientId: string;
  clientSecret: string;
  accessToken?: string;
  refreshToken?: string;
}

export default class ImgurClient {
  private clientId: string;
  private clientSecret: string;
  private accessToken?: string;
  private refreshToken?: string;

  constructor(options: ImgurClientOptions) {
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.accessToken = options.accessToken || undefined;
    this.refreshToken = options.refreshToken || undefined;
    this.initialize();
  }

  initialize(): void {
    console.log('Initializing ...');
  }

  async uploadImage(): Promise<string> {
    try {
      return '';
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
