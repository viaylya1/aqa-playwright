import BaseComponent from '../../../../components/BaseCoomponent';
import RemoveCarPopup from './components/RemoveCarPopup';

export default class EditCarPopup extends BaseComponent {
  _removeCarBtnSelector = 'button:has-text("Remove car")';

  constructor(page) {
    super(page);
    this.removeCarBtn = page.locator(this._removeCarBtnSelector);
  }

  async removeAddedCar() {
    await this.removeCarBtn.click();
    return new RemoveCarPopup(this._page);
  }
}
