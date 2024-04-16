import { loggedAsAqa, expect } from '../../src/fixtures/userGaragePage.js';
import { PROFILE_NAME_MOCK_RESPONSE } from './fixtures/profile_mock_response.js';

loggedAsAqa.describe('Mock Profile name', () => {
  loggedAsAqa('Should be shown mocked user name', async ({ garagePage, page }) => {
    const navBar = await garagePage.accessToNavBar();

    await page.route('/api/users/profile', (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(PROFILE_NAME_MOCK_RESPONSE)
    }));

    const profilePage = await navBar.openProfilePage();

    await expect(profilePage.profileNameContainer).toHaveText('Test Name');
  });
});
