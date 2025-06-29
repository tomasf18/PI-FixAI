from datetime import datetime
import time
import requests
import json
from typing import Dict, Tuple, Any
from camera import Camera
import threading
import os

from mqtt_sub import MQTTSubscriber

FRONTAL_SIGHT = 20
LATERAL_SIGHT = 15
DEGREE_SIGHT = 30
TIME_STEP = float(os.getenv("TIME_STEP", 0.5))

RTSP_URL = os.getenv("RTSP_URL", "rtsp://admin:@10.0.22.109:554//h264Preview_01_sub")
TARGET_FPS = 11.5
CLIP_DURATION = int(os.getenv("CLIP_DURATION", 5))
EDGE_DATA_ID = os.getenv("EDGE_DATA_ID", "4a8a0016-3304-11f0-be1f-325096b39f47")
API_URL = os.getenv("API_URL", "https://pedropinto.info/api/v1")

CURRENTLY_RECORDING_INCIDENTS_LOCK = threading.Lock()
CURRENTLY_RECORDING_INCIDENTS = set()

def get_values_from_message(message: Dict[str, Any]) -> Tuple[float, float, float, float]:
    cam = message["fields"]["cam"]["camParameters"]
    lat = cam["basicContainer"]["referencePosition"]["latitude"]
    lon = cam["basicContainer"]["referencePosition"]["longitude"]
    heading = cam["highFrequencyContainer"]["basicVehicleContainerHighFrequency"]["heading"]["headingValue"]
    speed = cam["highFrequencyContainer"]["basicVehicleContainerHighFrequency"]["speed"]["speedValue"]
    return lat, lon, heading, speed


def build_payload(latitude: float, longitude: float, heading: float, speed: float) -> Dict[str, float]:
    if speed > 0.5:
        frontal_sight = 40
        degree_sight = 20
    else:
        frontal_sight = FRONTAL_SIGHT
        degree_sight = DEGREE_SIGHT
    
    return {
        "latitude": latitude,
        "longitude": longitude,
        "heading": heading,
        "frontal_sight": frontal_sight,
        "lateral_sight": LATERAL_SIGHT,
        "degree_sight": degree_sight
    }


def check_nearby_request(payload: dict):
    try:
        response = requests.get(
            API_URL + "/incidents/check-nearby",
            params=payload,
            headers={"accept": "application/json"}
        )
        response.raise_for_status()
        # print("Payload sent successfully:", payload)
        return response.json()
    except requests.exceptions.RequestException as e:
        print("Error sending payload:", e)
    except json.JSONDecodeError as e:
        print("Error decoding JSON response:", e)

def report_resolution(file_name: str, incident_id: str, edge_data_id: str):
    try:
        print("[📤] Sending video report...", file_name)
        url = API_URL + "/incidents/process-video"
        
        data = {
            "incident_id": incident_id,
            "edge_data_id": edge_data_id
        }
        
        with open(file_name, 'rb') as f:
            files = {
                'video': (file_name, f, 'video/mp4')
            }
                
            # make the request
            resp = requests.post(url, data=data, files=files)

        print(f'Status code: {resp.status_code}')
        
        if resp.status_code != 200:
            print("Error: ", resp.text)
            return
                
    except requests.exceptions.RequestException as e:
        print("Error sending video report:", e)
    except json.JSONDecodeError as e:
        print("Error decoding JSON response:", e)


def record_incidents(camera: Camera, incident_id: str):
    output_file = f"./clips/incident_{incident_id}.mp4"
    
    out_writer = camera.add_output(output_file)
    time.sleep(CLIP_DURATION)
    camera.remove_output(out_writer)
    
    print(f"Saved recording to {output_file}")
    
    report_resolution(output_file, incident_id, EDGE_DATA_ID)
    
    with CURRENTLY_RECORDING_INCIDENTS_LOCK:
        CURRENTLY_RECORDING_INCIDENTS.remove(incident_id)
        print(f"Finished recording incident {incident_id}")
        print("Now: ", datetime.now().strftime("%H:%M:%S"), "\n")

def main():
    is_recording = False
    
    mqtt_subscriber = MQTTSubscriber()
    mqtt_subscriber.run()

    # Start camera recording in a separate thread
    camera = Camera(RTSP_URL, TARGET_FPS)
    threading.Thread(target=camera.record).start()
    
    while True:
        message, expiration_time = mqtt_subscriber.last_message
        
        if message is None:
            continue
        
        if expiration_time < datetime.now():
            print("Message expired, skipping...")
            mqtt_subscriber.last_message = (None, None)
            continue
        
        # print("Generated message:", message)
        lat, lon, heading, speed = get_values_from_message(message)
        # print(f"Extracted values - Latitude: {lat}, Longitude: {lon}, Heading: {heading}, Speed: {speed}")
        payload = build_payload(lat, lon, heading, speed)
        print("Check Incidents Nearby:", payload)
        response = check_nearby_request(payload)
        print("Response from server:", response, "\n")
        
        if response is None:
            print("Error: Response is None")
            continue

        for incident_id in response:
            print(f"Incident ID: {incident_id}")
            
            if incident_id in CURRENTLY_RECORDING_INCIDENTS:
                print(f"Already recording incident {incident_id}")
                continue
            
            with CURRENTLY_RECORDING_INCIDENTS_LOCK:
                CURRENTLY_RECORDING_INCIDENTS.add(incident_id)
                print(f"[✅] Start Recording incident {incident_id}!")
                print("Now: ", datetime.now().strftime("%H:%M:%S"), "\n")
                
                # Start a new thread for recording
                recording_thread = threading.Thread(target=record_incidents, args=(camera, incident_id))
                recording_thread.start()

        time.sleep(TIME_STEP)  # Simulate a delay between points


if __name__ == "__main__":
    main()
