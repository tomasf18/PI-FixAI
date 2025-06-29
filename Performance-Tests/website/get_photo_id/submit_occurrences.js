import http from "k6/http";
import { check } from "k6";

const BASE_URL = __ENV.BASE_URL;
const AUTH_TOKEN = __ENV.AUTH_TOKEN;
const LATITUDE = __ENV.LATITUDE;
const LONGITUDE = __ENV.LONGITUDE;
const NUMBER_OF_PHOTOS = __ENV.NUMBER_OF_PHOTOS;

// Preload all photos (only allowed here!)
const photos = [];
for (let i = 1; i <= NUMBER_OF_PHOTOS; i++) {
    const path = `utils/images/city_problems/city_problem_${i}.png`;
    const content = open(path, 'b');
    photos.push(content);
}

export default function () {

    if (!BASE_URL || !AUTH_TOKEN || !LATITUDE || !LONGITUDE) {
        console.error("Please set the BASE_URL, AUTH_TOKEN, LATITUDE, and LONGITUDE environment variables.");
        return;
    }
    
    // Loop over all photos
    for (let i = 0; i < photos.length; i++) {
        const fileContent = photos[i];
        
        // Pre-submission
        const formData = { photo: http.file(fileContent, 'photo.png', 'image/png'),};
        const preRes = http.post(`${BASE_URL}/api/v1/occurrences/pre-submission?latitude=${LATITUDE}&longitude=${LONGITUDE}`, formData, { headers: { "Cookie": `authToken=${AUTH_TOKEN}`, "Accept": "application/json", }});

        check(preRes, {"pre-submission status is 200": (r) => r.status === 200,});

        const preData = preRes.json();
        console.log(`Pre-submission response: ${JSON.stringify(preData)}`);
        const incident_id = preData.incident_id;
        const photo_id = preData.photo_id;

        console.log(`incident_id: ${incident_id}`);
        console.log(`photo_id: ${photo_id}`);

        // Submit occurrence
        const payload = JSON.stringify({
        incident_id: incident_id,
        photo_id: photo_id,
        category: "pavement",
        date: new Date().toISOString(),
        photo_latitude: LATITUDE,
        photo_longitude: LONGITUDE,
        description: `Prezados operadores,\n\nObserva-se um buraco no pavimento, representando um risco para veículos e pedestres. \n\nA profundidade do buraco pode causar danos aos veículos e acidentes. \n\nA área afetada necessita de reparo imediato para restaurar a segurança e a integridade da via.`,
        });

        const postRes = http.post(`${BASE_URL}/api/v1/occurrences`, payload, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Cookie": `authToken=${AUTH_TOKEN}`,
        },
        });
    }
}
