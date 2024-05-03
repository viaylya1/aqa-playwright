/* eslint-disable max-len */
import { expect } from '@playwright/test';
import moment from 'moment';
import { MODELS } from '../../../src/testData/models.js';
import { BRANDS } from '../../../src/testData/brands.js';

export async function createCars(newUser) {
  // Creating cars with all models of Audi

  const createdCarIds = [];
  const carsController = newUser.cars;

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

  return { createdCarIds, carsController };
}

export async function createCar(newUser) {
  // Creating one car

  const carsController = newUser.cars;

  const brandKeys = Object.keys(BRANDS);
  const randomBrand = BRANDS[brandKeys[Math.floor(Math.random() * brandKeys.length)]];

  const modelKeys = Object.keys(MODELS[randomBrand.id]);
  const randomModel = MODELS[randomBrand.id][modelKeys[Math.floor(Math.random() * modelKeys.length)]];

  const carData = {
    carBrandId: randomBrand.id,
    carModelId: randomModel.id,
    mileage: 10
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
    brand: randomBrand.title,
    model: randomModel.title,
    logo: randomBrand.logoFilename
  };

  expect(createCarResponse.status()).toBe(201);
  const createdCarsData = await createCarResponse.json();
  expect(createdCarsData.status).toBe('ok');
  expect(createdCarsData.data).toEqual(expectedCars);
  expect(moment(createdCarsData.data.updatedMileageAt).isAfter(startTime), 'updatedMileageAt should be valid').toBe(true);

  return { carsController, createdCarsData };
}
