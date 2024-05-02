import { request } from '@playwright/test';
import CarController from '../controllers/CarsController.js';
import AuthController from '../controllers/AuthController.js';
import UserController from '../controllers/UserController.js';

export default class APIClient {
  constructor(APIrequest) {
    this.auth = new AuthController(APIrequest);
    this.cars = new CarController(APIrequest);
    this.user = new UserController(APIrequest);
  }

  static async authenticateWithNewUser(signUpData) {
    const client = await request.newContext();
    const authController = new AuthController(client);
    await authController.signUp(signUpData);
    return new APIClient(client);
  }

  static async authenticate(userData) {
    const client = await request.newContext();
    const authController = new AuthController(client);
    await authController.signIn(userData);
    return new APIClient(client);
  }
}
