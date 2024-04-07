/* eslint-disable import/prefer-default-export */
import BasePage from '../BasePage';
import SignUpPopup from './components/SignUpPopup';

export default class WelcomePage extends BasePage {
  _welcomePageContentSelector = 'app-home';

  _signUpBtnSelector = 'button:has-text("Sign up")';

  constructor(page) {
    super(page, '');
    this.content = page.locator(this._welcomePageContentSelector);
    this.signUpBtn = page.locator(this._signUpBtnSelector);
  }

  async openSignUpPopup() {
    await this.signUpBtn.click();
    return new SignUpPopup(this._page);
  }
}
