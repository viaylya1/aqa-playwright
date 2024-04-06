export default class BasePage {
  constructor(page, url) {
    this._page = page;
    this._url = url;
  }

  async navigate() {
    await this._page.goto(this._url);
  }
}
