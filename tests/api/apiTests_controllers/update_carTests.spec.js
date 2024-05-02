import moment from 'moment';
import { loggedAsAqa, expect } from '../../../src/fixtures/userGaragePage.js';
import { MODELS } from '../../../src/testData/models.js';
import { BRANDS } from '../../../src/testData/brands.js';
import { WRONG_DATA } from '../../../src/testData/negativeCarsCreationData.js';
import CarController from '../../../src/controllers/CarsController.js';

loggedAsAqa.describe('Cars API cases', () => {
  let carsController;
  loggedAsAqa.beforeEach(async ({ request }) => {
    carsController = new CarController(request);
  });
});
