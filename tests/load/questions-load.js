import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  scenarios: {
    questions_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 500 }, // Ramp up to 500 users
        { duration: '2m', target: 500 },  // Stay at 500 users
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
const PRESENTATION_ID = '1'; // Adjust this to a valid presentation ID

export default function () {
  // Generate a unique author token for this virtual user
  const authorToken = `user_${__VU}_${Date.now()}`;
  
  // Post a new question
  const questionData = {
    presentationId: PRESENTATION_ID,
    content: `Test question from user ${__VU}`,
    author: `User ${__VU}`,
    authorToken: authorToken
  };

  const postRes = http.post(`${BASE_URL}/questions`, JSON.stringify(questionData), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(postRes, {
    'post question status is 200': (r) => r.status === 200,
    'post question response time < 5s': (r) => r.timings.duration < 5000,
  });

  // Get all questions to find ones to like
  const getQuestionsRes = http.get(`${BASE_URL}/questions?presentationId=${PRESENTATION_ID}`);
  check(getQuestionsRes, {
    'get questions status is 200': (r) => r.status === 200,
    'get questions response time < 5s': (r) => r.timings.duration < 5000,
  });

  if (getQuestionsRes.status === 200) {
    const questions = JSON.parse(getQuestionsRes.body);
    
    // Like 5 random questions
    for (let i = 0; i < 5; i++) {
      if (questions.length > 0) {
        const randomIndex = randomIntBetween(0, questions.length - 1);
        const questionToLike = questions[randomIndex];
        
        const likeRes = http.post(`${BASE_URL}/questions/${questionToLike.id}/like`, JSON.stringify({
          authorToken: authorToken
        }), {
          headers: { 'Content-Type': 'application/json' },
        });

        check(likeRes, {
          'like question status is 200': (r) => r.status === 200,
          'like question response time < 5s': (r) => r.timings.duration < 5000,
        });
      }
    }
  }

  sleep(1); // Add a small delay between iterations
} 