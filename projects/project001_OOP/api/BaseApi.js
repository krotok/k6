import http from 'k6/http';
import { check } from 'k6';

export class BaseApi {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  get(path, params = {}) {
    const res = http.get(`${this.baseUrl}${path}`, params);
    check(res, { [`GET ${path} success`]: r => r.status === 200 });
    return res;
  }

  post(path, body, params = {}) {
    const res = http.post(`${this.baseUrl}${path}`, JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' },
      ...params,
    });
    check(res, { [`POST ${path} success`]: r => r.status === 200 });
    return res;
  }

  put(path, body, params = {}) {
    const res = http.put(`${this.baseUrl}${path}`, JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' },
      ...params,
    });
    check(res, { [`PUT ${path} success`]: r => r.status === 200 });
    return res;
  }
}
