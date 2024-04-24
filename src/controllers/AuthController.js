import BaseController from './BaseController.js';

export default class AuthController extends BaseController {
  #SIGN_IN_PATH = '/auth/signin';

  #SIGN_UP_PATH = '/auth/signup';

  async signUp(userData) {
    return this._request.post(this.#SIGN_UP_PATH, userData);
  }

  async signIn({ email, password, remember = false }) {
    return this._request.post(this.#SIGN_IN_PATH, {
      data: {
        email,
        password,
        remember
      }
    });
  }
}
