import { check } from "k6";
import http from "k6/http";

const BASE_URL = __ENV.BASE_URL;
const AUTH_TOKEN = __ENV.AUTH_TOKEN;
const INCIDENT_ID = "43066d36-fac9-48e9-a206-4d4c1d7ee811";
const INCIDENT_STATUSES = ["pending", "in_progress", "resolved"];

export const options = {
  stages: [ 
      // ramp up from 0 to 20 VUs over the next 5 seconds 
      { duration: '30s', target: 5 }, 
      // run 20 VUs over the next 10 seconds 
      { duration: '30s', target: 10 }, 
      // ramp down from 20 to 0 VUs over the next 5 seconds 
      { duration: '30s', target: 0 }, 
  ]
};

  
export default function () {  
    // Get the incident status
    const incident_details = http.get(`${BASE_URL}/api/v1/incidents/${INCIDENT_ID}`, { headers: {"Cookie": `authToken=${AUTH_TOKEN}`,"Accept": "application/json",} });
    const incident_status = JSON.parse(incident_details.body).status;

    // Update the incident status to a random status (except the current one)
    // Note: In the backend I needed to comment the check for the status to be different from the current one because we have concurrent requests
    let new_status = null;
    while (new_status === null || new_status === incident_status) {
        const random_index = Math.floor(Math.random() * INCIDENT_STATUSES.length);
        new_status = INCIDENT_STATUSES[random_index];
    }

    const payload = JSON.stringify(new_status);
    const headers = {"Content-Type": "application/json","Accept": "application/json","Cookie": `authToken=${AUTH_TOKEN}`};
    const res = http.patch(`${BASE_URL}/api/v1/incidents/${INCIDENT_ID}/status`, payload, {headers});  

    check(res, {
      "status is 200": (r) => r.status === 200,
    }) || console.error(`❌ Failed with status ${res.status}: ${res.body}`);

    // Check the response
    // console.log(`Response time: ${res.timings.duration} ms`);
}