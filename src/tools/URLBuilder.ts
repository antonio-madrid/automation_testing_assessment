export default class URLBuilder {
  private readonly BASE_URL = process.env.BASE_URI;
  private readonly PORT = process.env.PORT;

  public getURL() {
    const url: URL = new URL(this.BASE_URL);
    url.port = this.PORT;
    return url;
  }
}
