import BaseComponent from '../../../components/BaseCoomponent';
import SettingsPage from '../SettingsPage/SettingsPage';
import ProfilePage from '../ProfilePage';

export default class NavBar extends BaseComponent {
  _settingsBtnSelector = 'a[routerLink=settings]';

  _profileBtnSelector = 'a[routerLink=profile]';

  constructor(page) {
    super(page);
    this.settingsBtn = page.locator(this._settingsBtnSelector);
    this.profileBtn = page.locator(this._profileBtnSelector);
  }

  async openSettingsPage() {
    await this.settingsBtn.click();
    return new SettingsPage(this._page);
  }

  async openProfilePage() {
    await this.profileBtn.click();
    return new ProfilePage(this._page);
  }
}
