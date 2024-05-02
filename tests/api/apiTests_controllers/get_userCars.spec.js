import { test, expect } from '@playwright/test';
import moment from 'moment';
import APIClient from '../../../src/client/APIClient.js';
import { signupDataGetUserCars } from '../../../src/testData/positiveSignUpData.js';
import { BRANDS } from '../../../src/testData/brands.js';
import { MODELS } from '../../../src/testData/models.js';

test.describe('GET Users Cars API cases', () => {
  let newUser;
  let carsController;
  const createdCarIds = [];

  test.beforeEach(async () => {
    newUser = await APIClient.authenticateWithNewUser(signupDataGetUserCars);
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

      const startTime = new Date();
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
      expect(moment(createdCarsData.data.updatedMileageAt).isAfter(startTime), 'updatedMileageAt should be valid').toBe(true);
    }
  });

  test.afterEach(async () => {
    createdCarIds.splice(0, createdCarIds.length);
    const response = await newUser.user.deleteUser();
    expect(response.status()).toBe(200);
  });

  test.describe('GET Current user cars', () => {
    test('GET Current user cars (positive case)', async () => {
      const response = await carsController.getUserCars();
      expect(response.status()).toBe(200);
      const responseData = await response.json();
      const userCars = responseData.data;

      expect(userCars.length).toBe(createdCarIds.length);
      const userCarIds = userCars.map((car) => car.id);
      expect(userCarIds).toEqual(expect.arrayContaining(createdCarIds));
    });

    test('GET Current user cars with invalid authentication (negative case)', async () => {
      const invalidCredentials = { email: 'invalidEmail@gmail.com', password: 'invalidPassword' };
      const invalidClient = await APIClient.authenticate(invalidCredentials);
      const response = await invalidClient.cars.getUserCars();

      expect(response.status()).toBe(401);
      expect(await response.json()).toMatchObject({
        status: 'error',
        message: 'Not authenticated'
      });
    });
  });

  test.describe('GET Current user cars by id (positive case)', () => {
    test('GET user car by CarID', async () => {
      const carID = createdCarIds[0];
      const response = await carsController.getUserCarByID(carID);
      expect(response.status()).toBe(200);
      const responseData = await response.json();
      const userCarById = responseData.data.id;
      expect(userCarById).toEqual(carID);
    });
  });

  test.describe('GET Current user cars by id (negative cases)', () => {
    test('GET Current user cars by invalid authentication', async () => {
      const invalidCredentials = { email: 'invalidEmail@gmail.com', password: 'invalidPassword' };
      const invalidClient = await APIClient.authenticate(invalidCredentials);

      const carID = createdCarIds[0];
      const response = await invalidClient.cars.getUserCarByID(carID);

      expect(response.status()).toBe(401);
      expect(await response.json()).toMatchObject({
        status: 'error',
        message: 'Not authenticated'
      });
    });
    test('GET Current user cars by invalid id', async () => {
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
