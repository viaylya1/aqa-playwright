// @ts-check
import { test, expect } from '@playwright/test';
import signupData from '../../src/signUp_testData/positiveSignUpData';
import {
  testNameData, testLastNameData, testEmailData, testPasswordData, testRepeatPasswordData
} from '../../src/signUp_testData/negativeSignUpData';

// Positive cases
test.describe('Positive registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('positive registration should work', async ({ page }) => {
    const signupPopup = page.locator('app-signup-modal');
    const invalidField = signupPopup.locator('div.invalid-feedback');
    const registerBtn = page.locator('button', { hasText: 'Register' });

    const signUpBtn = page.locator('button', { hasText: 'Sign up' });
    await signUpBtn.click();
    await expect(signupPopup).toBeVisible();

    for (const [fieldName, value] of Object.entries(signupData)) {
      const fieldLocator = signupPopup.locator(`#signup${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);
      await fieldLocator.fill(value);
      await expect(fieldLocator, `Filled in value should be '${value}'`).toHaveValue(value);

      if (fieldName === 'repeatPassword') {
        await expect(registerBtn, 'Register button should be enabled').toBeEnabled();
      } else {
        await expect(registerBtn, 'Register button should be disabled').toBeDisabled();
      }
    }

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
    const signUpBtn = page.locator('button', { hasText: 'Sign up' });
    await signUpBtn.click();
  });

  test.describe('"Name" field', () => {
    test('"Name" field cases', async ({ page }) => {
      const signupPopup = page.locator('app-signup-modal');
      const invalidField = signupPopup.locator('div.invalid-feedback');
      const nameField = signupPopup.locator('#signupName');
      const registerBtn = page.locator('button', { hasText: 'Register' });

      await test.step('Empty "Name" value should give an error', async () => {
        await nameField.focus();
        await nameField.blur();
        await expect(invalidField).toHaveText('Name required');
        await expect(signupPopup).toHaveScreenshot('Name required.png');
        await expect(registerBtn).toBeDisabled();
      });

      await test.step('Invalid "Name" values should give an error', async () => {
        for (const [fieldName, value] of Object.entries(testNameData)) {
          await nameField.fill(value);
          await expect(nameField, `Filled in value should be '${value}'`).toHaveValue(value);

          if (fieldName === 'shortValue' || fieldName === 'longValue') {
            await expect(invalidField).toHaveText('Name has to be from 2 to 20 characters long');
          } else if (fieldName === 'LongInvalidValue') {
            await expect(invalidField).toHaveText(/Name is invalid.*Name has to be from 2 to 20 characters long/);
          } else {
            await expect(invalidField).toHaveText('Name is invalid');
          }
          await expect(registerBtn).toBeDisabled();
          await nameField.clear();
        }
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

      await test.step('Empty "Last name" value should give an error', async () => {
        await lastNameField.focus();
        await lastNameField.blur();
        await expect(invalidField).toHaveText('Last name required');
        await expect(registerBtn).toBeDisabled();
      });

      await test.step('Invalid "Last name" values should give an error', async () => {
        for (const [fieldName, value] of Object.entries(testLastNameData)) {
          await lastNameField.fill(value);
          await expect(lastNameField, `Filled in value should be '${value}'`).toHaveValue(value);

          if (fieldName === 'shortValue' || fieldName === 'longValue') {
            await expect(invalidField).toHaveText('Last name has to be from 2 to 20 characters long');
          } else if (fieldName === 'LongInvalidValue') {
            await expect(invalidField).toHaveText(/Last name is invalid.*Last name has to be from 2 to 20 characters long/);
            await expect(signupPopup).toHaveScreenshot('Invalid and long Last name.png');
          } else {
            await expect(invalidField).toHaveText('Last name is invalid');
          }
          await expect(registerBtn).toBeDisabled();
          await lastNameField.clear();
        }
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

      await test.step('Empty "Email" value should give an error', async () => {
        await emailField.focus();
        await emailField.blur();
        await expect(invalidField).toHaveText('Email required');
        await expect(registerBtn).toBeDisabled();
      });

      await test.step('Invalid "Email" values should give an error', async () => {
        for (const [fieldName, value] of Object.entries(testEmailData)) {
          await emailField.fill(value);
          await expect(emailField, `Filled in value should be '${value}'`).toHaveValue(value);

          await expect(invalidField).toHaveText('Email is incorrect');
          if (fieldName === 'invalidValue7') {
            await expect(signupPopup).toHaveScreenshot('Incorrect Email.png');
          }

          await expect(registerBtn).toBeDisabled();
          await emailField.clear();
        }
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

      await test.step('Empty "Password" value should give an error', async () => {
        await passwordField.focus();
        await passwordField.blur();
        await expect(invalidField).toHaveText('Password required');
        await expect(registerBtn).toBeDisabled();
      });

      await test.step('Invalid "Password" values should give an error', async () => {
        for (const [fieldName, value] of Object.entries(testPasswordData)) {
          await passwordField.fill(value);
          await expect(passwordField, `Filled in value should be '${value}'`).toHaveValue(value);

          await expect(invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
          if (fieldName === 'longValue') {
            await expect(signupPopup).toHaveScreenshot('Invalid password.png');
          }

          await expect(registerBtn).toBeDisabled();
          await passwordField.clear();
        }
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

      await test.step('Empty "Re-enter password" value should give an error', async () => {
        await repeatPasswordField.focus();
        await repeatPasswordField.blur();
        await expect(invalidField).toHaveText('Re-enter password required');
        await expect(registerBtn).toBeDisabled();
      });

      await test.step('Invalid "Re-enter password" values should give an error', async () => {
        for (const [fieldName, value] of Object.entries(testRepeatPasswordData)) {
          await repeatPasswordField.fill(value);
          await expect(repeatPasswordField, `Filled in value should be '${value}'`).toHaveValue(value);

          if (fieldName === 'noMatch') {
            await expect(invalidField).toHaveText('Passwords do not match');
            await expect(signupPopup).toHaveScreenshot('No match password.png');
          } else {
            await expect(invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
          }

          await expect(registerBtn).toBeDisabled();
          await repeatPasswordField.clear();
        }
      });

      await test.step('"Re-enter password" input field should have red border in case of error', async () => {
        await expect(invalidField).toHaveCSS('border-color', 'rgb(220, 53, 69)');
      });
    });
  });
});
