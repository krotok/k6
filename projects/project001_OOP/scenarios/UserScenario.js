import { UserApi } from '../api/UserApi.js';
import { sleep } from 'k6';

export class UserScenario {
  constructor(baseUrl) {
    this.api = new UserApi(baseUrl);
  }

  run() {
    this.api.login('test', '1234');
    sleep(1);
    this.api.getData();
    sleep(1);
    this.api.updateData({ value: Math.floor(Math.random() * 100) });
    sleep(1);
  }
}
