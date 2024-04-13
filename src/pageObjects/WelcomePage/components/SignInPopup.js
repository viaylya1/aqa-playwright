import BaseComponent from '../../../components/BaseCoomponent';

export default class SignInPopup extends BaseComponent {
  _emailInputSelector = '#signinEmail';

  _passwordInputSelector = '#signinPassword';

  constructor(page) {
    super(page, page.locator('app-signin-modal'));
    this.emailInput = this.container.locator(this._emailInputSelector);
    this.emailInputErrorMessage = this.container.locator(`${this._emailInputSelector} + .invalid-feedback`);

    this.passwordInput = this.container.locator(this._passwordInputSelector);
    this.passwordInputErrorMessage = this.container.locator(`${this._passwordInputSelector} + .invalid-feedback`);

    this.signInButton = this.container.locator('.btn-primary');
  }
}
