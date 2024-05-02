import BaseController from './BaseController.js';

export default class UserController extends BaseController {
  #DELETE_USER_PATH = '/api/users';

  async deleteUser() {
    return this._request.delete(this.#DELETE_USER_PATH);
  }
}
