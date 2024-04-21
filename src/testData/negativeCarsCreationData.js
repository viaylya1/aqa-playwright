export const WRONG_DATA = [
  {
    name: 'negative mileage',
    requestBody: (brand, model) => ({
      carBrandId: brand.id,
      carModelId: model.id,
      mileage: -50
    }),
    expectedStatus: 400
  },
  {
    name: 'string mileage',
    requestBody: (brand, model) => ({
      carBrandId: brand.id,
      carModelId: model.id,
      mileage: 'string mileage'
    }),
    expectedStatus: 400
  },
  {
    name: 'missing mileage',
    requestBody: (brand, model) => ({
      carBrandId: brand.id,
      carModelId: model.id
    }),
    expectedStatus: 400
  },
  {
    name: 'Invalid Brand ID',
    requestBody: (model) => ({
      carBrandId: 999,
      carModelId: model.id
    }),
    expectedStatus: 400
  },
  {
    name: 'Invalid Model ID',
    requestBody: (brand) => ({
      carBrandId: brand.id,
      carModelId: 999
    }),
    expectedStatus: 400
  },
  {
    name: 'Empty request body',
    requestBody: () => ({}),
    expectedStatus: 400
  }
];
