import BaseComponent from '../../../../components/BaseCoomponent';

export default class RemovePopup extends BaseComponent {
  _removePopupSelector = 'app-remove-account-modal';

  _removeButtonSelector = ('div.modal-footer button:has-text("Remove")');

  constructor(page) {
    super(page);
    this.container = page.locator(this._removePopupSelector);
    this.removeBtn = page.locator(this._removeButtonSelector);
  }

  async removeUser() {
    await this.removeBtn.click();
  }
}
