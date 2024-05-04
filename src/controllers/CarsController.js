import BaseController from './BaseController.js';

export default class CarController extends BaseController {
  #CREATE_CAR_PATH = '/api/cars';

  #UPDATE_CAR_PATH = '/api/cars/#';

  #DELETE_USER_CARS_PATH = '/api/cars/#';

  #GET_USER_CARS_PATH = '/api/cars';

  #GET_USER_CAR_BY_ID_PATH = '/api/cars/#';

  #GET_CAR_BRANDS_PATH = 'api/cars/brands';

  #GET_CAR_BRAND_BY_ID_PATH = 'api/cars/brands/#';

  #GET_CAR_MODELS_PATH = 'api/cars/models';

  #GET_CAR_MODEL_BY_ID_PATH = 'api/cars/models/#';

  async createCar(data) {
    return this._request.post(this.#CREATE_CAR_PATH, { data });
  }

  async updateCar(id, newData) {
    return this._request.put(this.#UPDATE_CAR_PATH.replace('#', id), { data: newData });
  }

  async deleteCar(id) {
    return this._request.delete(this.#DELETE_USER_CARS_PATH.replace('#', id));
  }

  async getUserCars() {
    return this._request.get(this.#GET_USER_CARS_PATH);
  }

  async getUserCarByID(id) {
    return this._request.get(this.#GET_USER_CAR_BY_ID_PATH.replace('#', id));
  }

  async getCarsBrands() {
    return this._request.get(this.#GET_CAR_BRANDS_PATH);
  }

  async getCarBrandByID(id) {
    return this._request.get(this.#GET_CAR_BRAND_BY_ID_PATH.replace('#', id));
  }

  async getCarsModels() {
    return this._request.get(this.#GET_CAR_MODELS_PATH);
  }

  async getCarModelByID(id) {
    return this._request.get(this.#GET_CAR_MODEL_BY_ID_PATH.replace('#', id));
  }
}
