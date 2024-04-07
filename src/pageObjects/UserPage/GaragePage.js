import BaseComponent from '../../components/BaseCoomponent';
import NavBar from './components/NavBar';

export default class GaragePage extends BaseComponent {
  _garagePageContentSelector = 'div.app-content';

  constructor(page) {
    super(page);
    this.content = page.locator(this._garagePageContentSelector);
  }

  async accessToNavBar() {
    return new NavBar(this._page);
  }
}
