import BaseComponent from '../../components/BaseCoomponent';

export default class ProfilePage extends BaseComponent {
  _profileNameSelector = 'p.profile_name';

  constructor(page) {
    super(page);
    this.profileNameContainer = page.locator(this._profileNameSelector);
  }
}
