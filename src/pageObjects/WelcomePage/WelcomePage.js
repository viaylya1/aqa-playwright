/* eslint-disable import/prefer-default-export */
import BasePage from '../BasePage';
import SignUpPopup from './components/SignUpPopup';
import SignInPopup from './components/SignInPopup';

export default class WelcomePage extends BasePage {
  _welcomePageContentSelector = 'app-home';

  _signUpBtnSelector = 'button:has-text("Sign up")';

  _signInBtnSelector = 'button:has-text("Sign In")';

  constructor(page) {
    super(page, '');
    this.content = page.locator(this._welcomePageContentSelector);
    this.signUpBtn = page.locator(this._signUpBtnSelector);
    this.signInBtn = page.locator(this._signInBtnSelector);
  }

  async openSignUpPopup() {
    await this.signUpBtn.click();
    return new SignUpPopup(this._page);
  }

  async openSignInPopup() {
    await this.signInBtn.click();
    return new SignInPopup(this._page);
  }
}
