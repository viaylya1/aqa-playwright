import { loggedAsAqa, expect } from '../../../src/fixtures/userGaragePage.js';
import { MODELS } from '../../../src/testData/models.js';
import { BRANDS } from '../../../src/testData/brands.js';

loggedAsAqa.describe.only('Cars API', () => {
  const createdCarIds = [];
  loggedAsAqa.describe('Create cars positive cases', () => {
    loggedAsAqa('create car', async ({ request }) => {
      for (const brandKey of Object.keys(BRANDS)) {
        const brand = BRANDS[brandKey];
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
  });

  loggedAsAqa.afterEach(async ({ request }) => {
    for (const carId of createdCarIds) {
      const response = await request.delete(`/api/cars/${carId}`);
      expect(response.status()).toBe(200);
    }
  });
});
