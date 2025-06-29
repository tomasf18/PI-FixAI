import { check } from "k6";
import http from "k6/http";

const BASE_URL = __ENV.BASE_URL;
const AUTH_TOKEN = __ENV.AUTH_TOKEN;
const PHOTO_ID = "be0b713b-6373-4cb0-a9eb-1c168e06cbe0";

export const options = {
    stages: [ 
        // ramp up from 0 to 20 VUs over the next 5 seconds 
        { duration: '30s', target: 50 }, 
        // run 20 VUs over the next 10 seconds 
        { duration: '30s', target: 100 }, 
        // ramp down from 20 to 0 VUs over the next 5 seconds 
        { duration: '30s', target: 0 }, 
    ]
};

  
export default function () {  
    const photo_response = http.get(`${BASE_URL}/api/v1/photos/${PHOTO_ID}`, { headers: {"Cookie": `authToken=${AUTH_TOKEN}`,"Accept": "application/json",} });
    
    check(photo_response, {
        "photo status is 200": (r) => r.status === 200,
    });
}