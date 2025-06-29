# Tests to validate the website

## Test 1: `test_update_incident_status_1.js` 

### Test Plan: PATCH /api/v1/incidents/:id/status

**Objective:**  
Evaluate the performance and reliability of the `PATCH /api/v1/incidents/:id/status` endpoint under repeated updates by a single user.

**Setup:**

- Tool: k6
- Virtual Users: 1
- Iterations: 1000
- Expected Response: `null`
- Auth: Cookie-based JWT
- Monitored containers: `backend-api-1`, `backend-database-cassandra-1`, `backend-database-minio-1`

### Results Summary

- Total Requests: 1000
- Success Rate: 100%
- Failed Requests: 0
- 95th Percentile Response Time: = 78.69ms
- Average Iteration Duration: 121.54ms
- Max Iteration Duration: 148.8ms
- Min Iteration Duration: 79.39ms

### Thresholds

- `p(95)<500ms` - Passed
- `http_req_failed < 1%` - Passed

## Test 2: `test_get_photo_id.js`

### Test Plan: GET /api/v1/photos/:photo_id

**Objective:** What is the time taken to retrieve 100 photos by its ID?

**Use Case:** ServiceMapPage where the operator can see the photos of all the incidents.

### Setup:

- Tool: k6
- Virtual Users: 1
- Iterations: 100
- Expected Response: content-type image/webp
- Auth: Cookie-based JWT
- Monitored containers: `backend-api-1`, `backend-database-cassandra-1`, `backend-database-minio-1`

### Results Summary
