import BaseComponent from '../../../components/BaseCoomponent';
import SettingsPage from '../SettingsPage/SettingsPage';

export default class NavBar extends BaseComponent {
  _settingsBtnSelector = 'a[routerLink=settings]';

  constructor(page) {
    super(page);
    this.settingsBtn = page.locator(this._settingsBtnSelector);
  }

  async openSettingsPage() {
    await this.settingsBtn.click();
    return new SettingsPage(this._page);
  }
}
