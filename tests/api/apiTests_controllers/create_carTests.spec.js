/* eslint-disable no-loop-func */
import moment from 'moment';
import { loggedAsAqa, expect } from '../../../src/fixtures/userGaragePage.js';
import { MODELS } from '../../../src/testData/models.js';
import { BRANDS } from '../../../src/testData/brands.js';
import { WRONG_DATA } from '../../../src/testData/negativeCarsCreationData.js';
import CarController from '../../../src/controllers/CarsController.js';

loggedAsAqa.describe.only('Cars API cases', () => {
  let carsController;
  loggedAsAqa.beforeEach(async ({ request }) => {
    carsController = new CarController(request);
  });

  loggedAsAqa.describe('Create cars positive cases with Controller', () => {
    const createdCarIds = [];

    loggedAsAqa('create car', async () => {
      for (const brandName of Object.keys(BRANDS)) {
        const brand = BRANDS[brandName];
        for (const model of Object.values(MODELS[brand.id])) {
          await loggedAsAqa.step(`Create car with brand "${brand.title}" and model ${model.title}`, async () => {
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

    loggedAsAqa.afterAll(async ({ request }) => {
      carsController = new CarController(request);

      const carsResponse = await carsController.getUserCars();
      const cars = await carsResponse.json();

      await Promise.all(
        cars.data.map((car) => carsController.deleteCar(car.id))
      );
    });
  });

  loggedAsAqa.describe('Create cars negative cases', () => {
    for (const testCase of WRONG_DATA) {
      loggedAsAqa(`create a car with ${testCase.name}`, async () => {
        const brand = Object.values(BRANDS)[0];
        const model = Object.values(MODELS[brand.id])[0];
        const response = await carsController.createCar(testCase.requestBody(brand, model));
        expect(response.status()).toBe(testCase.expectedStatus);
      });
    }
  });
});
