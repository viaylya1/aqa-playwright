/* eslint-disable no-loop-func */
import { test, expect } from '@playwright/test';
import APIClient from '../../../src/client/APIClient.js';
import { signupDataGetCars } from '../../../src/testData/positiveSignUpData.js';
import { BRANDS_DATA } from '../../../src/testData/brands.js';
import { MODELS_DATA } from '../../../src/testData/models.js';

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
    test('GET Brands positive case', async () => {
      const response = await carsController.getCarsBrands();
      expect(response.status()).toBe(200);
      const responseData = await response.json();

      for (const expectedBrand of BRANDS_DATA.data) {
        const foundBrand = responseData.data.find((brand) => brand.id === expectedBrand.id);
        expect(foundBrand).toBeDefined();
        expect(foundBrand.title).toBe(expectedBrand.title);
        expect(foundBrand.logoFilename).toBe(expectedBrand.logoFilename);
      }
    });
  });

  test.describe('GET Brand by id', () => {
    test('GET Brand by id positive case', async () => {
      const brand = BRANDS_DATA.data[1];
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
    test('GET non-existing Brand by id (negative case)', async () => {
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
    test('GET Models positive case', async () => {
      const response = await carsController.getCarsModels();
      expect(response.status()).toBe(200);
      const responseData = await response.json();

      for (const expectedModel of MODELS_DATA.data) {
        const foundModel = responseData.data.find((model) => model.id === expectedModel.id);
        expect(foundModel).toBeDefined();
        expect(foundModel.title).toBe(expectedModel.title);
        expect(foundModel.logoFilename).toBe(expectedModel.logoFilename);
      }
    });
  });

  test.describe('GET Model by id', () => {
    test('GET Model by id positive case', async () => {
      const model = MODELS_DATA.data[0];
      const brand = BRANDS_DATA.data[0];
      const response = await carsController.getCarModelByID(model.id);
      expect(response.status()).toBe(200);
      expect(await response.json()).toMatchObject({
        status: 'ok',
        data: {
          id: model.id,
          carBrandId: brand.id,
          title: model.title
        }
      });
    });
    test('GET non-existing Model by id (negative case)', async () => {
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
