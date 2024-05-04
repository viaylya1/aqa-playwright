import { test, expect } from '@playwright/test';
import APIClient from '../../../src/client/APIClient.js';
import { signupDataGetUserCars } from '../../../src/testData/positiveSignUpData.js';
import { invalidCredentials } from '../../../src/testData/negativeSignInData.js';
import { createCars } from './testHelpers.js';

test.describe('GET Users Cars API cases', () => {
  let newUser;
  let carsController;
  let createdCarIds = [];

  test.beforeEach(async () => {
    createdCarIds.splice(0, createdCarIds.length);

    newUser = await APIClient.authenticateWithNewUser(signupDataGetUserCars);
    const creationResult = await createCars(newUser);
    createdCarIds = creationResult.createdCarIds;
    carsController = creationResult.carsController;
  });

  test.afterEach(async () => {
    const response = await newUser.user.deleteUser();
    expect(response.status()).toBe(200);
  });

  test.describe('GET Current user cars', () => {
    test('Positive case: GET Current user cars', async () => {
      const response = await carsController.getUserCars();

      expect(response.status()).toBe(200);
      const responseData = await response.json();
      const userCars = responseData.data;

      expect(userCars.length).toBe(createdCarIds.length);
      const userCarIds = userCars.map((car) => car.id);
      expect(userCarIds).toEqual(expect.arrayContaining(createdCarIds));
    });

    test('Negative case: GET Current user cars with invalid authentication', async () => {
      const invalidClient = await APIClient.authenticate(invalidCredentials);
      const response = await invalidClient.cars.getUserCars();

      expect(response.status()).toBe(401);
      expect(await response.json()).toMatchObject({
        status: 'error',
        message: 'Not authenticated'
      });
    });
  });

  test.describe('GET Current user cars by id ', () => {
    test('Positive case: GET user car by CarID', async () => {
      const carID = createdCarIds[0];

      const response = await carsController.getUserCarByID(carID);

      expect(response.status()).toBe(200);
      const responseData = await response.json();
      const userCarById = responseData.data.id;
      expect(userCarById).toEqual(carID);
    });

    test('Negative cases', async () => {
      await test.step('GET Current user cars by invalid authentication', async () => {
        const invalidClient = await APIClient.authenticate(invalidCredentials);
        const carID = createdCarIds[0];

        const response = await invalidClient.cars.getUserCarByID(carID);

        expect(response.status()).toBe(401);
        expect(await response.json()).toMatchObject({
          status: 'error',
          message: 'Not authenticated'
        });
      });

      await test.step('GET Current user cars by invalid id', async () => {
        const carID = 100;

        const response = await carsController.getUserCarByID(carID);

        expect(response.status()).toBe(404);
        expect(await response.json()).toMatchObject({
          status: 'error',
          message: 'Car not found'
        });
      });
    });
  });
});
