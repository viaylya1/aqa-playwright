/* eslint-disable no-loop-func */
import { test, expect } from '@playwright/test';
import APIClient from '../../../src/client/APIClient.js';
import { signupDataUpdateCars } from '../../../src/testData/positiveSignUpData.js';
import { invalidCredentials } from '../../../src/testData/negativeSignInData.js';
import { BRANDS } from '../../../src/testData/brands.js';
import { MODELS } from '../../../src/testData/models.js';

test.describe('Update Cars API cases', () => {
  let newUser;
  let carsController;
  const createdCarIds = [];

  test.beforeEach(async () => {
    newUser = await APIClient.authenticateWithNewUser(signupDataUpdateCars);
    carsController = newUser.cars;

    const audiModels = MODELS[BRANDS.Audi.id];
    const brand = BRANDS.Audi;

    for (const modelKey of Object.keys(audiModels)) {
      const model = audiModels[modelKey];

      const carData = {
        carBrandId: brand.id,
        carModelId: model.id,
        mileage: Math.floor(Math.random() * 100)
      };

      const createCarResponse = await carsController.createCar(carData);

      const expectedCars = {
        id: expect.any(Number),
        carBrandId: carData.carBrandId,
        carModelId: carData.carModelId,
        initialMileage: carData.mileage,
        updatedMileageAt: expect.any(String),
        carCreatedAt: expect.any(String),
        mileage: carData.mileage,
        brand: brand.title,
        model: model.title,
        logo: brand.logoFilename
      };

      expect(createCarResponse.status()).toBe(201);
      const createdCarsData = await createCarResponse.json();
      createdCarIds.push(createdCarsData.data.id);
      expect(createdCarsData.status).toBe('ok');
      expect(createdCarsData.data).toEqual(expectedCars);
    }
  });
  test.afterEach(async () => {
    createdCarIds.splice(0, createdCarIds.length);
    const response = await newUser.user.deleteUser();
    expect(response.status()).toBe(200);
  });

  test.describe('DELETE Cars (positive case)', () => {
    test('DELETE Car by id', async () => {
      const removeCarId = createdCarIds[0];
      const carsIdsBeforeRemoval = [...createdCarIds];

      const response = await carsController.deleteCar(removeCarId);
      expect(response.status()).toBe(200);
      expect(await response.json()).toMatchObject({
        status: 'ok',
        data: {
          carId: removeCarId
        }
      });

      const carsIdsAfterRemoval = createdCarIds.filter((id) => id !== removeCarId);

      expect(carsIdsAfterRemoval.length).toBe(carsIdsBeforeRemoval.length - 1);
      expect(carsIdsAfterRemoval).not.toContain(removeCarId);
    });
  });
  test.describe('DELETE Cars (negative cases)', () => {
    test('DELETE car with invalid id', async () => {
      const removeCarId = 111;

      const response = await carsController.deleteCar(removeCarId);
      expect(response.status()).toBe(404);
      expect(await response.json()).toMatchObject({
        status: 'error',
        message: 'Car not found'
      });
    });
    test('DELETE car without authentication', async () => {
      const removeCarId = createdCarIds[0];
      const invalidClient = await APIClient.authenticate(invalidCredentials);
      const response = await invalidClient.cars.deleteCar(removeCarId);
      expect(response.status()).toBe(401);
      expect(await response.json()).toMatchObject({
        status: 'error',
        message: 'Not authenticated'
      });
    });
  });
});
