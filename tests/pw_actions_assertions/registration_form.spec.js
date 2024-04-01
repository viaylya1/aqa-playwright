import { test, expect } from '@playwright/test';
// @ts-check

// Positive cases
test.describe('Positive registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('positive registration should work', async ({ page }) => {
    const signupPopup = page.locator('app-signup-modal');
    const invalidField = signupPopup.locator('div.invalid-feedback');
    const registerBtn = page.locator('button', { hasText: 'Register' });
    const signupData = {
      name: 'Vika',
      lastName: 'Bryzhak',
      email: 'aqa-vika@test.com',
      password: 'Test1Test',
      repeatPassword: 'Test1Test'
    };

    const signInBtn = page.locator('button', { hasText: 'Sign In' });
    await signInBtn.click();
    const signInPopup = page.locator('app-signin-modal');
    await expect(signInPopup).toBeVisible();

    const registrationBtn = page.getByRole('button', { name: /Registration/ });
    await registrationBtn.click();
    await expect(signupPopup).toBeVisible();

    const nameField = signupPopup.locator('#signupName');
    await nameField.fill(signupData.name);
    await expect(nameField, `Filled in value should be '${signupData.name}'`).toHaveValue(signupData.name);
    await expect(registerBtn, 'Register button should be disabled').toBeDisabled();

    const lastNameField = signupPopup.locator('#signupLastName');
    await lastNameField.fill(signupData.lastName);
    await expect(lastNameField, `Filled in value should be '${signupData.lastName}'`).toHaveValue(signupData.lastName);
    await expect(registerBtn, 'Register button should be disabled').toBeDisabled();

    const emailField = signupPopup.locator('#signupEmail');
    await emailField.fill(signupData.email);
    await expect(emailField, `Filled in value should be '${signupData.email}'`).toHaveValue(signupData.email);
    await expect(registerBtn, 'Register button should be disabled').toBeDisabled();

    const passwordField = signupPopup.locator('#signupPassword');
    await passwordField.fill(signupData.password);
    await expect(passwordField, `Filled in value should be '${signupData.password}'`).toHaveValue(signupData.password);
    await expect(registerBtn, 'Register button should be disabled').toBeDisabled();

    const repeatPasswordField = signupPopup.locator('#signupRepeatPassword');
    await repeatPasswordField.fill(signupData.repeatPassword);
    await expect(repeatPasswordField, `Filled in value should be '${signupData.repeatPassword}'`).toHaveValue(signupData.repeatPassword);
    await expect(registerBtn, 'Register button should be enabled').toBeEnabled();

    await expect(invalidField).toBeHidden();
    await expect(signupPopup).toHaveScreenshot('Sign up popup.png');

    await registerBtn.click();
    await expect(page).toHaveURL('/panel/garage');
    const pageAfterSignup = page.locator('div.panel-layout');
    await expect(pageAfterSignup).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const settingsBtn = page.locator('a[routerLink=settings]');
    await settingsBtn.click();
    const removeMyAccountBtn = page.locator('button', { hasText: 'Remove my account' });
    await removeMyAccountBtn.click();
    const removePopup = page.locator('app-remove-account-modal');
    await expect(removePopup).toBeVisible();
    const removeBtn = page.locator('div.modal-footer button', { hasText: 'Remove' });
    await removeBtn.click();
    await expect(page).toHaveURL('');
    const pageBeforeSignup = page.locator('div.app-content');
    await expect(pageBeforeSignup).toBeVisible();
  });
});

// Negative cases

test.describe('Negative registration cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    const signInBtn = page.locator('button', { hasText: 'Sign In' });
    await signInBtn.click();
    const registrationBtn = page.getByRole('button', { name: /Registration/ });
    await registrationBtn.click();
  });

  test.describe('"Name" field', () => {
    test('"Name" field cases', async ({ page }) => {
      const signupPopup = page.locator('app-signup-modal');
      const invalidField = signupPopup.locator('div.invalid-feedback');
      const nameField = signupPopup.locator('#signupName');
      const registerBtn = page.locator('button', { hasText: 'Register' });
      const testNameData = {
        shortValue: 'I',
        invalidValue1: 'Vi-ka',
        invalidValue2: '   Vika ',
        invalidValue3: '     ',
        invalidValue4: '111',
        notEnglishValue: 'Вика',
        longValue: 'ThisIsAnameWithMoreThanTwentyCharacters',
        LongInvalidValue: 'Invalid And LongNameWithMoreThanTwentyCharacters'

      };

      await test.step('Empty "Name" value should give an error', async () => {
        await nameField.focus();
        await nameField.blur();
        await expect(invalidField).toHaveText('Name required');
        await expect(signupPopup).toHaveScreenshot('Name required.png');
        await expect(registerBtn).toBeDisabled();
      });

      await test.step('Invalid "Name" values should give an error', async () => {
        await nameField.fill(testNameData.invalidValue1);
        await expect(invalidField).toHaveText('Name is invalid');
        await expect(registerBtn).toBeDisabled();
        await nameField.clear();

        await nameField.fill(testNameData.invalidValue2);
        await expect(invalidField).toHaveText('Name is invalid');
        await nameField.clear();

        await nameField.fill(testNameData.invalidValue3);
        await expect(invalidField).toHaveText('Name is invalid');
        await nameField.clear();

        await nameField.fill(testNameData.invalidValue4);
        await expect(invalidField).toHaveText('Name is invalid');
        await nameField.clear();

        await nameField.fill(testNameData.notEnglishValue);
        await expect(invalidField).toHaveText('Name is invalid');
        await nameField.clear();
      });
      await test.step('Values with inappropriate "Name" length should give an error', async () => {
        await nameField.fill(testNameData.shortValue);
        await expect(invalidField).toHaveText('Name has to be from 2 to 20 characters long');
        await expect(registerBtn).toBeDisabled();
        await nameField.clear();

        await nameField.fill(testNameData.longValue);
        await expect(invalidField).toHaveText('Name has to be from 2 to 20 characters long');
        await nameField.clear();

        await nameField.fill(testNameData.LongInvalidValue);
        await expect(invalidField).toHaveText(/Name is invalid.*Name has to be from 2 to 20 characters long/);
        await nameField.clear();
      });
      await test.step('"Name" input field should have red border in case of error', async () => {
        await expect(invalidField).toHaveCSS('border-color', 'rgb(220, 53, 69)');
      });
    });
  });

  test.describe('"Last name" field', () => {
    test('"Last name" field cases', async ({ page }) => {
      const signupPopup = page.locator('app-signup-modal');
      const invalidField = signupPopup.locator('div.invalid-feedback');
      const lastNameField = signupPopup.locator('#signupLastName');
      const registerBtn = page.locator('button', { hasText: 'Register' });
      const testNameData = {
        shortValue: 'B',
        invalidValue1: 'Bry-zhak',
        invalidValue2: '   Bryzhak ',
        invalidValue3: '     ',
        invalidValue4: '222',
        notEnglishValue: 'Брыжак',
        longValue: 'ThisIsALastNameWithMoreThanTwentyCharacters',
        LongInvalidValue: 'Invalid And LongLastNameWithMoreThanTwentyCharacters'

      };

      await test.step('Empty "Last name" value should give an error', async () => {
        await lastNameField.focus();
        await lastNameField.blur();
        await expect(invalidField).toHaveText('Last name required');
        await expect(registerBtn).toBeDisabled();
      });

      await test.step('Invalid "Last name" values should give an error', async () => {
        await lastNameField.fill(testNameData.invalidValue1);
        await expect(invalidField).toHaveText('Last name is invalid');
        await expect(registerBtn).toBeDisabled();
        await lastNameField.clear();

        await lastNameField.fill(testNameData.invalidValue2);
        await expect(invalidField).toHaveText('Last name is invalid');
        await lastNameField.clear();

        await lastNameField.fill(testNameData.invalidValue3);
        await expect(invalidField).toHaveText('Last name is invalid');
        await lastNameField.clear();

        await lastNameField.fill(testNameData.invalidValue4);
        await expect(invalidField).toHaveText('Last name is invalid');
        await lastNameField.clear();

        await lastNameField.fill(testNameData.notEnglishValue);
        await expect(invalidField).toHaveText('Last name is invalid');
        await expect(signupPopup).toHaveScreenshot('Invalid Last name.png');
        await lastNameField.clear();
      });
      await test.step('Values with inappropriate "Last name" length should give an error', async () => {
        await lastNameField.fill(testNameData.shortValue);
        await expect(invalidField).toHaveText('Last name has to be from 2 to 20 characters long');
        await expect(registerBtn).toBeDisabled();
        await lastNameField.clear();

        await lastNameField.fill(testNameData.longValue);
        await expect(invalidField).toHaveText('Last name has to be from 2 to 20 characters long');
        await lastNameField.clear();

        await lastNameField.fill(testNameData.LongInvalidValue);
        await expect(invalidField).toHaveText(/Last name is invalid.*Last name has to be from 2 to 20 characters long/);
        await lastNameField.clear();
      });
      await test.step('"Last Name" input field should have red border in case of error', async () => {
        await expect(invalidField).toHaveCSS('border-color', 'rgb(220, 53, 69)');
      });
    });
  });

  test.describe('"Email" field', () => {
    test('"Email" field cases', async ({ page }) => {
      const signupPopup = page.locator('app-signup-modal');
      const invalidField = signupPopup.locator('div.invalid-feedback');
      const emailField = signupPopup.locator('#signupEmail');
      const registerBtn = page.locator('button', { hasText: 'Register' });
      const testNameData = {
        invalidValue1: '   vika@test.com',
        invalidValue2: 'vikatest.com',
        invalidValue3: '     ',
        invalidValue4: 'vika@.com',
        invalidValue5: 'vika@test.c',
        invalidValue6: '@test.com',
        invalidValue7: 'vika@test'

      };

      await test.step('Empty "Email" value should give an error', async () => {
        await emailField.focus();
        await emailField.blur();
        await expect(invalidField).toHaveText('Email required');
        await expect(registerBtn).toBeDisabled();
      });

      await test.step('Invalid "Email" values should give an error', async () => {
        await emailField.fill(testNameData.invalidValue1);
        await expect(invalidField).toHaveText('Email is incorrect');
        await expect(registerBtn).toBeDisabled();
        await emailField.clear();

        await emailField.fill(testNameData.invalidValue2);
        await expect(invalidField).toHaveText('Email is incorrect');
        await emailField.clear();

        await emailField.fill(testNameData.invalidValue3);
        await expect(invalidField).toHaveText('Email is incorrect');
        await emailField.clear();

        await emailField.fill(testNameData.invalidValue4);
        await expect(invalidField).toHaveText('Email is incorrect');
        await emailField.clear();

        await emailField.fill(testNameData.invalidValue5);
        await expect(invalidField).toHaveText('Email is incorrect');
        await emailField.clear();

        await emailField.fill(testNameData.invalidValue6);
        await expect(invalidField).toHaveText('Email is incorrect');
        await emailField.clear();

        await emailField.fill(testNameData.invalidValue7);
        await expect(invalidField).toHaveText('Email is incorrect');
        await expect(signupPopup).toHaveScreenshot('Incorrect Email.png');
        await emailField.clear();
      });
      await test.step('"Email" input field should have red border in case of error', async () => {
        await expect(invalidField).toHaveCSS('border-color', 'rgb(220, 53, 69)');
      });
    });
  });

  test.describe('"Password" field', () => {
    test('"Password" field cases', async ({ page }) => {
      const signupPopup = page.locator('app-signup-modal');
      const invalidField = signupPopup.locator('div.invalid-feedback');
      const passwordField = signupPopup.locator('#signupPassword');
      const registerBtn = page.locator('button', { hasText: 'Register' });
      const testNameData = {
        invalidValue1: 'nocapital1',
        invalidValue2: 'noNumberHere',
        invalidValue3: '     ',
        invalidValue4: '123456789',
        invalidValue5: 'ALLCAPITAL1',
        notEnglishValue: 'ЯзыкЯзык1',
        shortValue: 'Short6',
        longValue: 'LongValueMore15Symbols'

      };

      await test.step('Empty "Password" value should give an error', async () => {
        await passwordField.focus();
        await passwordField.blur();
        await expect(invalidField).toHaveText('Password required');
        await expect(registerBtn).toBeDisabled();
      });

      await test.step('Invalid "Password" values should give an error', async () => {
        await passwordField.fill(testNameData.invalidValue1);
        await expect(invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await expect(registerBtn).toBeDisabled();
        await passwordField.clear();

        await passwordField.fill(testNameData.invalidValue2);
        await expect(invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await passwordField.clear();

        await passwordField.fill(testNameData.invalidValue3);
        await expect(invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await passwordField.clear();

        await passwordField.fill(testNameData.invalidValue4);
        await expect(invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await passwordField.clear();

        await passwordField.fill(testNameData.invalidValue5);
        await expect(invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await passwordField.clear();

        await passwordField.fill(testNameData.notEnglishValue);
        await expect(invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await passwordField.clear();
      });
      await test.step('Values with inappropriate "Password" length should give an error', async () => {
        await passwordField.fill(testNameData.shortValue);
        await expect(invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await expect(registerBtn).toBeDisabled();
        await passwordField.clear();

        await passwordField.fill(testNameData.longValue);
        await expect(invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await expect(signupPopup).toHaveScreenshot('Invalid password.png');
        await passwordField.clear();
      });
      await test.step('"Password" input field should have red border in case of error', async () => {
        await expect(invalidField).toHaveCSS('border-color', 'rgb(220, 53, 69)');
      });
    });
  });

  test.describe('"Re-enter password" field', () => {
    test('"Re-enter password" field cases', async ({ page }) => {
      const signupPopup = page.locator('app-signup-modal');
      const invalidField = signupPopup.locator('div.invalid-feedback');
      const repeatPasswordField = signupPopup.locator('#signupRepeatPassword');
      const registerBtn = page.locator('button', { hasText: 'Register' });
      const testNameData = {
        noMatch: 'noMatchPass1',
        invalidValue1: 'nocapital1',
        invalidValue2: 'noNumberHere',
        invalidValue3: '     ',
        invalidValue4: '123456789',
        invalidValue5: 'ALLCAPITAL1',
        notEnglishValue: 'ЯзыкЯзык1',
        shortValue: 'Short6',
        longValue: 'LongValueMore15Symbols'
      };

      await test.step('Empty "Re-enter password" value should give an error', async () => {
        await repeatPasswordField.focus();
        await repeatPasswordField.blur();
        await expect(invalidField).toHaveText('Re-enter password required');
        await expect(registerBtn).toBeDisabled();
      });

      await test.step('No match "Re-enter password" should give an error', async () => {
        await repeatPasswordField.fill(testNameData.noMatch);
        await expect(invalidField).toHaveText('Passwords do not match');
        await expect(signupPopup).toHaveScreenshot('No match password.png');
        await expect(registerBtn).toBeDisabled();
        await repeatPasswordField.clear();
      });

      await test.step('Invalid "Re-enter password" values should give an error', async () => {
        await repeatPasswordField.fill(testNameData.invalidValue1);
        await expect(invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await expect(registerBtn).toBeDisabled();
        await repeatPasswordField.clear();

        await repeatPasswordField.fill(testNameData.invalidValue2);
        await expect(invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await repeatPasswordField.clear();

        await repeatPasswordField.fill(testNameData.invalidValue3);
        await expect(invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await repeatPasswordField.clear();

        await repeatPasswordField.fill(testNameData.invalidValue4);
        await expect(invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await repeatPasswordField.clear();

        await repeatPasswordField.fill(testNameData.invalidValue5);
        await expect(invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await repeatPasswordField.clear();

        await repeatPasswordField.fill(testNameData.notEnglishValue);
        await expect(invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await repeatPasswordField.clear();
      });
      await test.step('Values with inappropriate "Re-enter password" length should give an error', async () => {
        await repeatPasswordField.fill(testNameData.shortValue);
        await expect(invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await expect(registerBtn).toBeDisabled();
        await repeatPasswordField.clear();

        await repeatPasswordField.fill(testNameData.longValue);
        await expect(invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await repeatPasswordField.clear();
      });
      await test.step('"Re-enter password" input field should have red border in case of error', async () => {
        await expect(invalidField).toHaveCSS('border-color', 'rgb(220, 53, 69)');
      });
    });
  });
});
