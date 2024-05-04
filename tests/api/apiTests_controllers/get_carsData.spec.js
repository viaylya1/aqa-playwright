/* eslint-disable no-loop-func */
import { test, expect } from '@playwright/test';
import APIClient from '../../../src/client/APIClient.js';
import { signupDataGetCars } from '../../../src/testData/positiveSignUpData.js';
import { BRANDS } from '../../../src/testData/brands.js';
import { MODELS } from '../../../src/testData/models.js';

test.describe('GET Cars API cases', () => {
  let newUser;
  let carsController;

  test.beforeEach(async () => {
    newUser = await APIClient.authenticateWithNewUser(signupDataGetCars);
    carsController = newUser.cars;
  });
  test.afterEach(async () => {
    if (newUser) {
      await newUser.user.deleteUser();
    }
  });

  test.describe('GET Brands', () => {
    test('Positive case: GET Brands', async () => {
      const response = await carsController.getCarsBrands();
      expect(response.status()).toBe(200);
      const responseData = await response.json();

      for (const brandKey of Object.keys(BRANDS)) {
        const expectedBrand = BRANDS[brandKey];
        const foundBrand = responseData.data.find((brand) => brand.id === expectedBrand.id);
        expect(foundBrand).toBeDefined();
        expect(foundBrand.title).toBe(expectedBrand.title);
        expect(foundBrand.logoFilename).toBe(expectedBrand.logoFilename);
      }
    });
  });

  test.describe('GET Brand by id', () => {
    test('Positive case: GET Brand by id', async () => {
      const brand = Object.values(BRANDS)[0];

      const response = await carsController.getCarBrandByID(brand.id);
      expect(response.status()).toBe(200);
      expect(await response.json()).toMatchObject({
        status: 'ok',
        data: {
          id: brand.id,
          title: brand.title,
          logoFilename: brand.logoFilename
        }
      });
    });

    test('Negative case: GET non-existing Brand by id', async () => {
      const brandID = 10;
      const response = await carsController.getCarBrandByID(brandID);

      expect(response.status()).toBe(404);
      expect(await response.json()).toMatchObject({
        status: 'error',
        message: 'No car brands found with this id'
      });
    });
  });

  test.describe('GET Models', () => {
    test('Positive case: GET Models', async () => {
      const response = await carsController.getCarsModels();
      expect(response.status()).toBe(200);
      const responseData = await response.json();

      for (const models of Object.values(MODELS)) {
        for (const model of Object.values(models)) {
          const foundModel = responseData.data.find((m) => m.id === model.id);
          expect(foundModel).toBeDefined();
          expect(foundModel.title).toBe(model.title);
          expect(foundModel.logoFilename).toBe(model.logoFilename);
        }
      }
    });
  });

  test.describe('GET Model by id', () => {
    test('Positive case: GET Model by id', async () => {
      const brandKey = Object.keys(MODELS)[0];
      const models = MODELS[brandKey];
      const modelKey = Object.keys(models)[0];
      const model = models[modelKey];

      const response = await carsController.getCarModelByID(model.id);
      expect(response.status()).toBe(200);
      expect(await response.json()).toMatchObject({
        status: 'ok',
        data: {
          id: model.id,
          carBrandId: model.carBrandId,
          title: model.title
        }
      });
    });

    test('Negative case: GET non-existing Model by id', async () => {
      const modelID = 100;
      const response = await carsController.getCarModelByID(modelID);

      expect(response.status()).toBe(404);
      expect(await response.json()).toMatchObject({
        status: 'error',
        message: 'No car models found with this id'
      });
    });
  });
});
