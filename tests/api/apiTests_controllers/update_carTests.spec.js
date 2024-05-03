/* eslint-disable no-loop-func */
import { test, expect } from '@playwright/test';
import moment from 'moment';
import APIClient from '../../../src/client/APIClient.js';
import { signupDataDeleteCars } from '../../../src/testData/positiveSignUpData.js';
import { invalidCredentials } from '../../../src/testData/negativeSignInData.js';
import { BRANDS_DATA } from '../../../src/testData/brands.js';
import { MODELS_DATA } from '../../../src/testData/models.js';

test.describe('UPDATE Cars API cases', () => {
  let newUser;
  let carsController;
  let createdCarsData;
  let updateCarId;
  let updatedBrand;
  let updatedModel;
  let updatedCarData;

  test.beforeEach(async () => {
    newUser = await APIClient.authenticateWithNewUser(signupDataDeleteCars);
    carsController = newUser.cars;

    const brand = BRANDS_DATA.data[0];
    const model = MODELS_DATA.data[0];

    const carData = {
      carBrandId: brand.id,
      carModelId: model.id,
      mileage: 10
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
    createdCarsData = await createCarResponse.json();
    expect(createdCarsData.status).toBe('ok');
    expect(createdCarsData.data).toEqual(expectedCars);
  });

  test.afterEach(async () => {
    const response = await newUser.user.deleteUser();
    expect(response.status()).toBe(200);
  });

  test.describe('UPDATE Cars (positive case)', () => {
    test('UPDATE Car by id', async () => {
      updateCarId = createdCarsData.data.id;
      [updatedBrand] = BRANDS_DATA.data.slice(1);
      [updatedModel] = MODELS_DATA.data.slice(6);

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
  });

  test.describe('UPDATE Cars (negative cases)', () => {
    test('UPDATE car with invalid id', async () => {
      const invalidCarId = 111;

      const response = await carsController.updateCar(invalidCarId, updatedCarData);
      expect(response.status()).toBe(404);
      expect(await response.json()).toMatchObject({
        status: 'error',
        message: 'Car not found'
      });
    });
    test('UPDATE car without authentication', async () => {
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
