import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    initial_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 500 }, // Ramp up to 500 users
        { duration: '1m', target: 500 },  // Stay at 500 users
        { duration: '30s', target: 0 },   // Ramp down to 0
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<5000'], // 95% of requests should complete within 5 seconds
    http_req_failed: ['rate<0.01'],    // Less than 1% of requests should fail
  },
};

const BASE_URL = 'http://localhost:3000'; // Adjust this to your server URL

export default function () {
  // Test conference endpoint
  const conferenceRes = http.get(`${BASE_URL}/conference`);
  check(conferenceRes, {
    'conference status is 200': (r) => r.status === 200,
    'conference response time < 5s': (r) => r.timings.duration < 5000,
  });

  // Test program endpoint
  const programRes = http.get(`${BASE_URL}/presentations`);
  check(programRes, {
    'program status is 200': (r) => r.status === 200,
    'program response time < 5s': (r) => r.timings.duration < 5000,
  });

  // Test presenters endpoint
  const presentersRes = http.get(`${BASE_URL}/people`);
  check(presentersRes, {
    'presenters status is 200': (r) => r.status === 200,
    'presenters response time < 5s': (r) => r.timings.duration < 5000,
  });

  // Test notifications endpoint
  const notificationsRes = http.get(`${BASE_URL}/announcements`);
  check(notificationsRes, {
    'notifications status is 200': (r) => r.status === 200,
    'notifications response time < 5s': (r) => r.timings.duration < 5000,
  });

  sleep(1); // Add a small delay between iterations
} 