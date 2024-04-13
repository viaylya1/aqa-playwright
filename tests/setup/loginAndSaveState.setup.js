import { test as setup } from '@playwright/test';
import WelcomePage from '../../src/pageObjects/WelcomePage/WelcomePage.js';
import { expect } from '../../src/fixtures/userGaragePage.js';
import { AQA_STORAGE_STATE_PATH } from '../../src/constants.js';

setup.describe('Setup', () => {
  setup('Login and Save as AQA', async ({ page }) => {
    const welcomePage = new WelcomePage(page);
    await welcomePage.navigate();
    const signInPopup = await welcomePage.openSignInPopup();
    await signInPopup.emailInput.fill('viaylya@gmail.com');
    await signInPopup.passwordInput.fill('9RTloNV4gwIYjQ2');
    await signInPopup.signInButton.click();

    await expect(page).toHaveURL(/garage/);

    await page.context().storageState({
      path: AQA_STORAGE_STATE_PATH
    });
  });
});
