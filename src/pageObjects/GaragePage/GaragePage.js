import BaseComponent from '../../components/BaseCoomponent';

export default class GaragePage extends BaseComponent {
  _garagePageContentSelector = 'div.app-content';

  _settingsBtnSelector = 'a[routerLink=settings]';

  _removePopupSelector = 'app-remove-account-modal';

  _removeMyAccountBtnSelector = 'button:has-text("Remove my account")';

  _removeButtonSelector = ('div.modal-footer button:has-text("Remove")');

  constructor(page) {
    super(page);
    this.content = page.locator(this._garagePageContentSelector);
    this.settingsBtn = page.locator(this._settingsBtnSelector);
    this.removeMyAccountBtn = page.locator(this._removeMyAccountBtnSelector);
    this.removePopup = page.locator(this._removePopupSelector);
    this.removeBtn = page.locator(this._removeButtonSelector);
  }

  async openRemovePopup() {
    await this.settingsBtn.click();
    await this.removeMyAccountBtn.click();
  }

  async removeUser() {
    await this.removeBtn.click();
  }
}
