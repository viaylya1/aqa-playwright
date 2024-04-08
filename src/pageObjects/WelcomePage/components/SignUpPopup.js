import BaseComponent from '../../../components/BaseCoomponent';
import GaragePage from '../../UserPage/GaragePage';

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
    this.nameErrorMessage = this.container.locator(`${this._nameInputSelector} + .invalid-feedback`);
    this.lastNameField = this.container.locator(this._lastNameInputSelector);
    this.lastNameErrorMessage = this.container.locator(`${this._lastNameInputSelector} + .invalid-feedback`);
    this.emailField = this.container.locator(this._emailInputSelector);
    this.emailErrorMessage = this.container.locator(`${this._emailInputSelector} + .invalid-feedback`);
    this.passwordField = this.container.locator(this._passwordInputSelector);
    this.passwordErrorMessage = this.container.locator(`${this._passwordInputSelector} + .invalid-feedback`);
    this.repeatPasswordField = this.container.locator(this._repeatPasswordInputSelector);
    this.repeatPasswordErrorMessage = this.container.locator(`${this._repeatPasswordInputSelector} + .invalid-feedback`);
    this.invalidFields = this.container.locator(this._invalidFieldSelector);
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
