import { loggedAsAqa, expect } from '../../src/fixtures/userGaragePage.js';

loggedAsAqa.describe('Add a new car', () => {
  loggedAsAqa('C4025: should add a new car', async ({ garagePage }) => {
    await expect(garagePage.addCarButton).toBeVisible();
    const addCarPopup = await garagePage.openAddCarPopup();
    const brand = 'BMW';
    const model = 'X6';
    const milleage = '100';
    await addCarPopup.addCarBrand.selectOption(brand);
    await addCarPopup.addCarModel.selectOption(model);
    await addCarPopup.addCarMilleage.fill(milleage);
    await addCarPopup.addNewCar();
    await expect(garagePage.addedCarContainer).toBeVisible();
    expect(garagePage.addedCarName).toHaveText(`${brand} ${model}`);
  });
  loggedAsAqa.afterEach(async ({ garagePage }) => {
    const editCarPopup = await garagePage.openEditCarPopup();
    const removeCarPopup = await editCarPopup.removeAddedCar();
    await removeCarPopup.removeBtn.click();
    await expect(garagePage.emptyGarage).toBeVisible();
  });
});
