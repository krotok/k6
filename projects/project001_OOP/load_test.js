import { UserScenario } from './scenarios/UserScenario.js';

export const options = {
  stages: [
    { duration: '5s', target: 2 },
    { duration: '10s', target: 4 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    checks: ['rate>0.95'],
  },
};

const BASE_URL = 'http://localhost:5000';

export default function () {
  const scenario = new UserScenario(BASE_URL);
  scenario.run();
}
