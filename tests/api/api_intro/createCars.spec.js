import { loggedAsAqa, expect } from '../../../src/fixtures/userGaragePage.js';
import { MODELS } from '../../../src/testData/models.js';
import { BRANDS } from '../../../src/testData/brands.js';
import { WRONG_DATA } from '../../../src/testData/negativeCarsCreationData.js';

loggedAsAqa.describe('Cars API cases', () => {
  loggedAsAqa.describe('Positive cases: Create cars', () => {
    const createdCarIds = [];
    loggedAsAqa('create car', async ({ request }) => {
      for (const brandName of Object.keys(BRANDS)) {
        const brand = BRANDS[brandName];
        for (const model of Object.values(MODELS[brand.id])) {
          await loggedAsAqa.step(`Create car with brand "${brand.title}" and model ${model.title}`, async () => {
            const requestBody = {
              carBrandId: brand.id,
              carModelId: model.id,
              mileage: Math.floor(Math.random() * 100)
            };
            const response = await request.post('/api/cars', {
              data: requestBody
            });

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
          });
        }
      }
    });
    loggedAsAqa.afterEach(async ({ request }) => {
      for (const carId of createdCarIds) {
        const response = await request.delete(`/api/cars/${carId}`);
        expect(response.status()).toBe(200);
      }
    });
  });

  loggedAsAqa.describe('Negative cases: Create cars', () => {
    for (const testCase of WRONG_DATA) {
      loggedAsAqa(`create a car with ${testCase.name}`, async ({ request }) => {
        const brand = Object.values(BRANDS)[0];
        const model = Object.values(MODELS[brand.id])[0];
        const response = await request.post('/api/cars', {
          data: testCase.requestBody(brand, model)
        });
        expect(response.status()).toBe(testCase.expectedStatus);
      });
    }
  });
});
