import BasePage from '../BasePage';
import AddCarPopup from './components/AddCarPopup';
import EditCarPopup from './components/editCar/EditCarPopup';
import NavBar from './components/NavBar';

export default class GaragePage extends BasePage {
  _garagePageContentSelector = 'div.app-content';

  _addCarBtnSelector = 'button:has-text("Add car")';

  _addedCarContainerSelector = '.jumbotron';

  _addedCarNameSelector = 'p.car_name';

  _editCarBtnSelector = '.icon-edit';

  _noCarsSelector = '.panel-empty_message';

  constructor(page) {
    super(page, '/panel/garage');
    this.content = page.locator(this._garagePageContentSelector);
    this.addCarButton = page.locator(this._addCarBtnSelector);
    this.addedCarContainer = page.locator(this._addedCarContainerSelector);
    this.addedCarName = page.locator(this._addedCarNameSelector);
    this.editCarBtn = page.locator(this._editCarBtnSelector);
    this.emptyGarage = page.locator(this._noCarsSelector);
  }

  async accessToNavBar() {
    return new NavBar(this._page);
  }

  async openAddCarPopup() {
    await this.addCarButton.click();
    return new AddCarPopup(this._page);
  }

  async openEditCarPopup() {
    await this.editCarBtn.click();
    return new EditCarPopup(this._page);
  }
}
