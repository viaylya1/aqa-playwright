// @ts-check
import { test, expect } from '@playwright/test';
import { signupDataPom } from '../../src/signUp_testData/positiveSignUpData.js';
import {
  testNameData, testLastNameData, testEmailData, testPasswordData, testRepeatPasswordData
} from '../../src/signUp_testData/negativeSignUpData.js';
import WelcomePage from '../../src/pageObjects/WelcomePage/WelcomePage.js';

test.describe('Auth', () => {
  let welcomePage;
  let garagePage;
  let signUpPopup;

  test.beforeEach(async ({ page }) => {
    welcomePage = new WelcomePage(page);
    await welcomePage.navigate();
    signUpPopup = await welcomePage.openSignUpPopup();
  });

  // Positive cases
  test.describe('Positive registration', () => {
    test('positive registration should work', async ({ page }) => {
      await signUpPopup.waitLoaded();

      for (const [fieldName, value] of Object.entries(signupDataPom)) {
        const fieldLocator = signUpPopup.getFieldLocator(fieldName);
        await fieldLocator.fill(value);
        await expect(fieldLocator, `Filled in value should be '${value}'`).toHaveValue(value);

        if (fieldName === 'repeatPassword') {
          await expect(signUpPopup.registerBtn, 'Register button should be enabled').toBeEnabled();
        } else {
          await expect(signUpPopup.registerBtn, 'Register button should be disabled').toBeDisabled();
        }
      }

      await expect(signUpPopup.invalidField).toBeHidden();
      await expect(signUpPopup.container).toHaveScreenshot('Sign up popup.png');

      garagePage = await signUpPopup.register();
      await expect(page).toHaveURL('/panel/garage');
      await expect(garagePage.content).toBeVisible();
    });

    test.afterEach(async ({ page }) => {
      await garagePage.openRemovePopup();
      await expect(garagePage.removePopup).toBeVisible();
      await garagePage.removeBtn.click();
      await expect(page).toHaveURL('');
      await expect(welcomePage.content).toBeVisible();
    });
  });

  // Negative cases

  test.describe('Negative registration cases', () => {
    test.describe('"Name" field', () => {
      test('"Name" field cases', async () => {
        await test.step('Empty "Name" value should give an error', async () => {
          await signUpPopup.nameField.focus();
          await signUpPopup.nameField.blur();
          await expect(signUpPopup.invalidField).toHaveText('Name required');
          await expect(signUpPopup.container).toHaveScreenshot('Name required.png');
          await expect(signUpPopup.registerBtn).toBeDisabled();
        });

        await test.step('Invalid "Name" values should give an error', async () => {
          for (const [fieldName, value] of Object.entries(testNameData)) {
            await signUpPopup.nameField.fill(value);
            await expect(signUpPopup.nameField, `Filled in value should be '${value}'`).toHaveValue(value);

            if (fieldName === 'shortValue' || fieldName === 'longValue') {
              await expect(signUpPopup.invalidField).toHaveText('Name has to be from 2 to 20 characters long');
            } else if (fieldName === 'LongInvalidValue') {
              await expect(signUpPopup.invalidField).toHaveText(/Name is invalid.*Name has to be from 2 to 20 characters long/);
            } else {
              await expect(signUpPopup.invalidField).toHaveText('Name is invalid');
            }
            await expect(signUpPopup.registerBtn).toBeDisabled();
            await signUpPopup.nameField.clear();
          }
        });

        await test.step('"Name" input field should have red border in case of error', async () => {
          await expect(signUpPopup.invalidField).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        });
      });
    });

    test.describe('"Last name" field', () => {
      test('"Last name" field cases', async () => {
        await test.step('Empty "Last name" value should give an error', async () => {
          await signUpPopup.lastNameField.focus();
          await signUpPopup.lastNameField.blur();
          await expect(signUpPopup.invalidField).toHaveText('Last name required');
          await expect(signUpPopup.registerBtn).toBeDisabled();
        });

        await test.step('Invalid "Last name" values should give an error', async () => {
          for (const [fieldName, value] of Object.entries(testLastNameData)) {
            await signUpPopup.lastNameField.fill(value);
            await expect(signUpPopup.lastNameField, `Filled in value should be '${value}'`).toHaveValue(value);

            if (fieldName === 'shortValue' || fieldName === 'longValue') {
              await expect(signUpPopup.invalidField).toHaveText('Last name has to be from 2 to 20 characters long');
            } else if (fieldName === 'LongInvalidValue') {
              await expect(signUpPopup.invalidField).toHaveText(/Last name is invalid.*Last name has to be from 2 to 20 characters long/);
              await expect(signUpPopup.container).toHaveScreenshot('Invalid and long Last name.png');
            } else {
              await expect(signUpPopup.invalidField).toHaveText('Last name is invalid');
            }
            await expect(signUpPopup.registerBtn).toBeDisabled();
            await signUpPopup.lastNameField.clear();
          }
        });

        await test.step('"Last Name" input field should have red border in case of error', async () => {
          await expect(signUpPopup.invalidField).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        });
      });
    });

    test.describe('"Email" field', () => {
      test('"Email" field cases', async () => {
        await test.step('Empty "Email" value should give an error', async () => {
          await signUpPopup.emailField.focus();
          await signUpPopup.emailField.blur();
          await expect(signUpPopup.invalidField).toHaveText('Email required');
          await expect(signUpPopup.registerBtn).toBeDisabled();
        });

        await test.step('Invalid "Email" values should give an error', async () => {
          for (const [fieldName, value] of Object.entries(testEmailData)) {
            await signUpPopup.emailField.fill(value);
            await expect(signUpPopup.emailField, `Filled in value should be '${value}'`).toHaveValue(value);

            await expect(signUpPopup.invalidField).toHaveText('Email is incorrect');
            if (fieldName === 'invalidValue7') {
              await expect(signUpPopup.container).toHaveScreenshot('Incorrect Email.png');
            }

            await expect(signUpPopup.registerBtn).toBeDisabled();
            await signUpPopup.emailField.clear();
          }
        });

        await test.step('"Email" input field should have red border in case of error', async () => {
          await expect(signUpPopup.invalidField).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        });
      });
    });

    test.describe('"Password" field', () => {
      test('"Password" field cases', async () => {
        await test.step('Empty "Password" value should give an error', async () => {
          await signUpPopup.passwordField.focus();
          await signUpPopup.passwordField.blur();
          await expect(signUpPopup.invalidField).toHaveText('Password required');
          await expect(signUpPopup.registerBtn).toBeDisabled();
        });

        await test.step('Invalid "Password" values should give an error', async () => {
          for (const [fieldName, value] of Object.entries(testPasswordData)) {
            await signUpPopup.passwordField.fill(value);
            await expect(signUpPopup.passwordField, `Filled in value should be '${value}'`).toHaveValue(value);

            await expect(signUpPopup.invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
            if (fieldName === 'longValue') {
              await expect(signUpPopup.container).toHaveScreenshot('Invalid password.png');
            }

            await expect(signUpPopup.registerBtn).toBeDisabled();
            await signUpPopup.passwordField.clear();
          }
        });

        await test.step('"Password" input field should have red border in case of error', async () => {
          await expect(signUpPopup.invalidField).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        });
      });
    });

    test.describe('"Re-enter password" field', () => {
      test('"Re-enter password" field cases', async () => {
        await test.step('Empty "Re-enter password" value should give an error', async () => {
          await signUpPopup.repeatPasswordField.focus();
          await signUpPopup.repeatPasswordField.blur();
          await expect(signUpPopup.invalidField).toHaveText('Re-enter password required');
          await expect(signUpPopup.registerBtn).toBeDisabled();
        });

        await test.step('Invalid "Re-enter password" values should give an error', async () => {
          for (const [fieldName, value] of Object.entries(testRepeatPasswordData)) {
            await signUpPopup.repeatPasswordField.fill(value);
            await expect(signUpPopup.repeatPasswordField, `Filled in value should be '${value}'`).toHaveValue(value);

            if (fieldName === 'noMatch') {
              await expect(signUpPopup.invalidField).toHaveText('Passwords do not match');
              await expect(signUpPopup.container).toHaveScreenshot('No match password.png');
            } else {
              await expect(signUpPopup.invalidField).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
            }

            await expect(signUpPopup.registerBtn).toBeDisabled();
            await signUpPopup.repeatPasswordField.clear();
          }
        });

        await test.step('"Re-enter password" input field should have red border in case of error', async () => {
          await expect(signUpPopup.invalidField).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        });
      });
    });
  });
});
