import BaseComponent from '../../../components/BaseCoomponent';
import GaragePage from '../../GaragePage/GaragePage';

export default class SignUpPopup extends BaseComponent {
  _nameInputSelector = '#signupName';

  _lastNameInputSelector = '#signupLastName';

  _emailInputSelector = '#signupEmail';

  _passwordInputSelector = '#signupPassword';

  _repeatPasswordInputSelector = '#signupRepeatPassword';

  _invalidFieldSelector = 'div.invalid-feedback';

  _registerBtnSelector = 'button:has-text("Register")';

  constructor(page) {
    super(page, page.locator('app-signup-modal'));
    this.nameField = this.container.locator(this._nameInputSelector);
    this.lastNameField = this.container.locator(this._lastNameInputSelector);
    this.emailField = this.container.locator(this._emailInputSelector);
    this.passwordField = this.container.locator(this._passwordInputSelector);
    this.repeatPasswordField = this.container.locator(this._repeatPasswordInputSelector);
    this.invalidField = this.container.locator(this._invalidFieldSelector);
    this.registerBtn = this.container.locator(this._registerBtnSelector);
  }

  getFieldLocator(fieldName) {
    const selector = `#signup${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`;
    return this.container.locator(selector);
  }

  async register() {
    await this.registerBtn.click();
    return new GaragePage(this._page);
  }
}
