import BaseController from './BaseController.js';

export default class CarController extends BaseController {
  #CREATE_CAR_PATH = '/api/cars';

  #UPDATE_CAR_PATH = '/api/cars/#';

  #GET_USER_CARS_PATH = '/api/cars';

  #DELETE_USER_CARS_PATH = '/api/cars/#';

  async createCar(data) {
    return this._request.post(this.#CREATE_CAR_PATH, { data });
  }

  async getUserCars() {
    return this._request.get(this.#GET_USER_CARS_PATH);
  }

  async deleteCar(id) {
    return this._request.delete(this.#DELETE_USER_CARS_PATH.replace('#', id));
  }

  async updateCar(id, newData) {
    return this._request.put(this.#UPDATE_CAR_PATH.replace('#', id), newData);
  }
}
