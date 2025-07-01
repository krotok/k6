import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import ws from 'k6/ws';

export let options = {
  thresholds: {
    http_req_duration: ['p(95)<500'],
    'checks': ['rate>0.95'],
    'http_req_failed': ['rate<0.05'],
  },
  stages: [
    { duration: '10s', target: 5 },
    { duration: '20s', target: 10 },
    { duration: '10s', target: 0 },
  ],
  scenarios: {
    login_and_update: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5s', target: 5 },
        { duration: '10s', target: 10 },
        { duration: '5s', target: 0 },
      ],
      exec: 'userFlow'
    },
    websocket_chat: {
      executor: 'constant-vus',
      vus: 5,
      duration: '20s',
      exec: 'chatFlow'
    }
  }
};

let baseURL = 'http://localhost:5000';

export function userFlow() {
  group('Login', () => {
    const res = http.post(`${baseURL}/login`, JSON.stringify({
      username: 'test',
      password: '1234',
    }), { headers: { 'Content-Type': 'application/json' } });

    check(res, {
      'login status is 200': (r) => r.status === 200,
      'received token': (r) => r.json().token !== undefined,
    });
  });

  group('Read and Update Data', () => {
    let res1 = http.get(`${baseURL}/data`);
    check(res1, {
      'read data is 200': (r) => r.status === 200,
    });

    let res2 = http.put(`${baseURL}/data`, JSON.stringify({ value: Math.floor(Math.random() * 100) }), {
      headers: { 'Content-Type': 'application/json' }
    });

    check(res2, {
      'update is 200': (r) => r.status === 200,
    });
  });

  sleep(1);
}

export function chatFlow() {
  const url = 'ws://localhost:5000/socket.io/?EIO=4&transport=websocket';

  const res = ws.connect(url, function (socket) {
    socket.on('open', function () {
      socket.send('hello server');
    });

    socket.on('message', function (data) {
      console.log(`Received: ${data}`);
    });

    socket.setTimeout(function () {
      socket.close();
    }, 3000);
  });

  check(res, {
    'websocket status is 101': (r) => r && r.status === 101,
  });
}
