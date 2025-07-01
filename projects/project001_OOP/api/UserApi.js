import { BaseApi } from './BaseApi.js';

export class UserApi extends BaseApi {
  constructor(baseUrl) {
    super(baseUrl);
    this.token = null;
  }

  login(username, password) {
    const res = this.post('/login', { username, password });
    if (res.status === 200) {
      this.token = res.json('token');
    }
    return res;
  }

  getData() {
    return this.get('/data', { headers: this._authHeader() });
  }

  updateData(newData) {
    return this.put('/data', newData, { headers: this._authHeader() });
  }

  _authHeader() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }
}
