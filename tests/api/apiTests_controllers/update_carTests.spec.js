/* eslint-disable no-loop-func */
import { test, expect } from '@playwright/test';
import moment from 'moment';
import APIClient from '../../../src/client/APIClient.js';
import { signupDataUpdateCars } from '../../../src/testData/positiveSignUpData.js';
import { invalidCredentials } from '../../../src/testData/negativeSignInData.js';
import { BRANDS } from '../../../src/testData/brands.js';
import { MODELS } from '../../../src/testData/models.js';
import { createCar } from './testHelpers.js';

test.describe('UPDATE Cars API cases', () => {
  let newUser;
  let carsController;
  let createdCarsData;
  let updateCarId;
  let updatedBrand;
  let updatedModel;
  let updatedCarData;

  test.beforeEach(async () => {
    newUser = await APIClient.authenticateWithNewUser(signupDataUpdateCars);
    carsController = newUser.cars;
    const creationResult = await createCar(newUser);
    carsController = creationResult.carsController;
    createdCarsData = creationResult.createdCarsData;
  });

  test.afterEach(async () => {
    const response = await newUser.user.deleteUser();
    expect(response.status()).toBe(200);
  });

  test.describe('UPDATE Cars', () => {
    test('Positive case: UPDATE Car by id', async () => {
      updateCarId = createdCarsData.data.id;

      updatedBrand = BRANDS.BMW;
      const audiModels = MODELS[updatedBrand.id];
      const modelKeys = Object.keys(audiModels);
      updatedModel = audiModels[modelKeys[0]];

      updatedCarData = {
        carBrandId: updatedBrand.id,
        carModelId: updatedModel.id,
        mileage: createdCarsData.data.mileage + 10
      };

      const startTime = new Date();
      const response = await carsController.updateCar(updateCarId, updatedCarData);
      expect(response.status()).toBe(200);
      const receivedCarsData = await response.json();

      const expectedCarData = {
        id: createdCarsData.data.id,
        carBrandId: updatedCarData.carBrandId,
        carModelId: updatedCarData.carModelId,
        initialMileage: createdCarsData.data.mileage,
        updatedMileageAt: expect.any(String),
        carCreatedAt: expect.any(String),
        mileage: updatedCarData.mileage,
        brand: updatedBrand.title,
        model: updatedModel.title,
        logo: updatedBrand.logoFilename
      };

      expect(receivedCarsData.status).toBe('ok');
      expect(receivedCarsData.data).toEqual(expectedCarData);
      expect(moment(receivedCarsData.data.updatedMileageAt).isAfter(startTime), 'updatedMileageAt should be valid').toBe(true);
    });

    test('Negative cases', async () => {
      await test.step('UPDATE car with invalid id', async () => {
        const invalidCarId = 111;

        const response = await carsController.updateCar(invalidCarId, updatedCarData);
        expect(response.status()).toBe(404);
        expect(await response.json()).toMatchObject({
          status: 'error',
          message: 'Car not found'
        });
      });

      await test.step('UPDATE car without authentication', async () => {
        const invalidClient = await APIClient.authenticate(invalidCredentials);
        const response = await invalidClient.cars.updateCar(updateCarId, updatedCarData);
        expect(response.status()).toBe(401);
        expect(await response.json()).toMatchObject({
          status: 'error',
          message: 'Not authenticated'
        });
      });
    });
  });
});
