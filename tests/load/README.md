# Load Testing Scripts

This directory contains k6 load testing scripts for the conference application.

## Prerequisites

1. Install k6 from https://k6.io/docs/getting-started/installation/
2. Make sure your application is running and accessible
3. Update the `BASE_URL` in the test scripts to match your server URL
4. For the questions test, update the `PRESENTATION_ID` to a valid presentation ID

## Test Scenarios

### 1. Initial Load Test (`initial-load.js`)

This test simulates 500 concurrent users accessing the main endpoints:
- Conference information
- Program/schedule
- Presenters
- Notifications

The test will:
- Ramp up to 500 users over 30 seconds
- Maintain 500 users for 1 minute
- Ramp down over 30 seconds

### 2. Questions Load Test (`questions-load.js`)

This test simulates 500 concurrent users:
- Posting new questions
- Liking 5 random questions each

The test will:
- Ramp up to 500 users over 30 seconds
- Maintain 500 users for 2 minutes
- Ramp down over 30 seconds

## Running the Tests

To run the initial load test:
```bash
k6 run initial-load.js
```

To run the questions load test:
```bash
k6 run questions-load.js
```

## Success Criteria

A test is considered successful if:
1. 95% of all requests complete within 5 seconds
2. Less than 1% of requests fail
3. All HTTP responses return status code 200

## Test Results

The test will output detailed metrics including:
- Request duration percentiles
- Request failure rate
- Number of virtual users
- Requests per second
- Data transfer rates

You can also export the results to various formats (JSON, CSV, etc.) for further analysis. 