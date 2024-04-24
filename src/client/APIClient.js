import { request } from '@playwright/test';
import CarController from '../controllers/CarsContoller.js';
import AuthController from '../controllers/AuthController.js';

export default class APIClient {
  constructor(request) {
    this.auth = new AuthController(request);
    this.cars = new CarController(request);
  }

  static async authenticateWithNewUser(registerData) {
    const client = request.newContext();
    const authController = new AuthController(client);
    await authController.signUp(registerData);
    // await authController.signIn({email: registerData.email, password: registerData.password})
    return new APIClient(client);
  }

  static async authenticate(userData) {
    const client = request.newContext();
    const authController = new AuthController(client);
    await authController.signIn(userData);
    return new APIClient(client);
  }
}

// const apiClient = await APIClient.authenticate({email: "", password: ""})
// await apiClient.cars.createCar()
