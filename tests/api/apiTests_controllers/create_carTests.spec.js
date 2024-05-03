/* eslint-disable no-loop-func */
import moment from 'moment';
import { test, expect } from '@playwright/test';
import APIClient from '../../../src/client/APIClient.js';
import { signupDataCreateCarsMain } from '../../../src/testData/positiveSignUpData.js';
import { MODELS } from '../../../src/testData/models.js';
import { BRANDS } from '../../../src/testData/brands.js';
import { WRONG_DATA } from '../../../src/testData/negativeCarsCreationData.js';

test.describe('Cars API cases', () => {
  let newUser;
  let carsController;

  test.beforeAll(async () => {
    newUser = await APIClient.authenticateWithNewUser(signupDataCreateCarsMain);
    carsController = newUser.cars;
  });

  test.afterEach(async () => {
    const carsResponse = await carsController.getUserCars();
    const cars = await carsResponse.json();

    await Promise.all(
      cars.data.map(async (car) => {
        try {
          await carsController.deleteCar(car.id);
        } catch (error) {
          console.error(`Error deleting car with id ${car.id}:`, error);
        }
      })
    );
  });

  test.afterAll(async () => {
    if (newUser) {
      await newUser.user.deleteUser();
    }
  });

  test.describe('Create cars with Controller', () => {
    test('Positive case: Create cars', async () => {
      const createdCarIds = [];

      for (const brandName of Object.keys(BRANDS)) {
        const brand = BRANDS[brandName];
        for (const model of Object.values(MODELS[brand.id])) {
          await test.step(`Create car with brand "${brand.title}" and model ${model.title}`, async () => {
            const requestBody = {
              carBrandId: brand.id,
              carModelId: model.id,
              mileage: Math.floor(Math.random() * 100)
            };
            const startTime = new Date();
            const response = await carsController.createCar(requestBody);

            const body = await response.json();
            createdCarIds.push(body.data.id);
            const expected = {
              id: expect.any(Number),
              carBrandId: requestBody.carBrandId,
              carModelId: requestBody.carModelId,
              initialMileage: requestBody.mileage,
              updatedMileageAt: expect.any(String),
              carCreatedAt: expect.any(String),
              mileage: requestBody.mileage,
              brand: brand.title,
              model: model.title,
              logo: brand.logoFilename
            };

            expect(response.status()).toBe(201);
            expect(body.status).toBe('ok');
            expect(body.data).toEqual(expected);
            expect(moment(body.data.updatedMileageAt).isAfter(startTime), 'updatedMileageAt should be valid').toBe(true);
          });
        }
      }
    });

    test('Negative cases', async () => {
      for (const testCase of WRONG_DATA) {
        await test.step(`create a car with ${testCase.name}`, async () => {
          const brand = Object.values(BRANDS)[0];
          const model = Object.values(MODELS[brand.id])[0];
          const response = await carsController.createCar(testCase.requestBody(brand, model));
          expect(response.status()).toBe(testCase.expectedStatus);
        });
      }
    });
  });
});
