import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const loadTime = new Trend('load_time');

// Configuration
export const options = {
  vus: 500, // 500 virtual users
  duration: '1m',
  thresholds: {
    'errors': ['rate<0.1'], // Error rate should be less than 10%
    'load_time': ['p(95)<2000'], // 95% of requests should be below 2s
  },
};

// Test data
const BASE_URL = 'https://konference.jk9.eu';

// Endpoints to test
const endpoints = [
  '/',
  '/questions',
  '/presentations',
  '/announcements',
  '/people',
  '/conference',
  '/images'
];

export default function () {
  // Test each endpoint
  endpoints.forEach(endpoint => {
    const url = `${BASE_URL}${endpoint}`;
    const startTime = new Date();
    
    const response = http.get(url);
    
    // Record metrics
    const endTime = new Date();
    const duration = endTime - startTime;
    loadTime.add(duration);
    
    // Check response
    check(response, {
      'status is 200': (r) => r.status === 200,
      'response time < 2000ms': (r) => r.timings.duration < 2000,
    });
    
    errorRate.add(response.status !== 200);
    
    // Sleep between requests to avoid overwhelming the server
    sleep(1);
  });
} 