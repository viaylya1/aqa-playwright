import BaseController from './BaseController.js';

export default class AuthController extends BaseController {
  #SIGN_IN_PATH = '/api/auth/signin';

  #SIGN_UP_PATH = '/api/auth/signup';

  async signUp(signUpData) {
    return this._request.post(this.#SIGN_UP_PATH, { data: signUpData });
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
