import BaseComponent from '../../../components/BaseCoomponent';

export default class AddCarPopup extends BaseComponent {
  _addCarBrandSelector = '#addCarBrand';

  _addCarModelSelector = '#addCarModel';

  _addCarMilleageSelector = '#addCarMileage';

  _addCarBtnSelector = '.modal-content  .btn-primary';

  constructor(page) {
    super(page);
    this.addCarBrand = page.locator(this._addCarBrandSelector);
    this.addCarModel = page.locator(this._addCarModelSelector);
    this.addCarMilleage = page.locator(this._addCarMilleageSelector);
    this.addCarBtn = page.locator(this._addCarBtnSelector);
  }

  async addNewCar() {
    await this.addCarBtn.click();
  }
}
