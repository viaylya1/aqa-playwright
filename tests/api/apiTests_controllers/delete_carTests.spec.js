/* eslint-disable no-loop-func */
import { test, expect } from '@playwright/test';
import APIClient from '../../../src/client/APIClient.js';
import { signupDataDeleteCars } from '../../../src/testData/positiveSignUpData.js';
import { invalidCredentials } from '../../../src/testData/negativeSignInData.js';
import { createCars } from './testHelpers.js';

test.describe('DELETE Cars API cases', () => {
  let newUser;
  let carsController;
  let createdCarIds = [];

  test.beforeEach(async () => {
    createdCarIds.splice(0, createdCarIds.length);

    newUser = await APIClient.authenticateWithNewUser(signupDataDeleteCars);
    const creationResult = await createCars(newUser);
    createdCarIds = creationResult.createdCarIds;
    carsController = creationResult.carsController;
  });

  test.afterEach(async () => {
    const response = await newUser.user.deleteUser();
    expect(response.status()).toBe(200);
  });

  test.describe('DELETE Car', () => {
    test('Positive case: DELETE Car by id', async () => {
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

  test.describe('DELETE Cars', () => {
    test('Negative cases', async () => {
      await test.step('DELETE car with invalid id', async () => {
        const removeCarId = 111;

        const response = await carsController.deleteCar(removeCarId);

        expect(response.status()).toBe(404);
        expect(await response.json()).toMatchObject({
          status: 'error',
          message: 'Car not found'
        });
      });

      await test.step('DELETE car without authentication', async () => {
        const removeCarId = createdCarIds[0];
        const invalidClient = await APIClient.authenticate(invalidCredentials);

        const response = await invalidClient.cars.deleteCar(removeCarId);

        expect(response.status()).toBe(401);
        expect(await response.json()).toMatchObject({
          status: 'error',
          message: 'Not authenticated'
        });
      });

      await test.step('DELETE car that was already deleted', async () => {
        const removeCarId = createdCarIds[0];

        let response = await carsController.deleteCar(removeCarId);
        expect(response.status()).toBe(200);

        response = await carsController.deleteCar(removeCarId);
        expect(response.status()).toBe(404);
        expect(await response.json()).toMatchObject({
          status: 'error',
          message: 'Car not found'
        });
      });
    });
  });
});
