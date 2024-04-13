import BaseComponent from '../../../../../components/BaseCoomponent';

export default class RemoveCarPopup extends BaseComponent {
  _removeBtnSelector = 'button:has-text("Remove")';

  constructor(page) {
    super(page, page.locator('app-remove-car-modal'));
    this.removeBtn = this.container.locator(this._removeBtnSelector);
  }

  async removeAddedCar() {
    await this.removeBtn.click();
  }
}
