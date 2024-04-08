/* eslint-disable import/no-extraneous-dependencies */
import { expect } from '@playwright/test';

export default class BaseComponent {
  constructor(page, container) {
    this._page = page;
    this.container = container;
  }

  async waitLoaded() {
    await expect(this.container).toBeVisible();
  }
}
