# python 3.11

import json
from datetime import datetime, timedelta
import random
import os

from queue import Queue
from paho.mqtt import client as mqtt_client


broker = os.getenv("MQTT_BROKER", "localhost")
port = int(os.getenv("MQTT_PORT", 1883))
topic = os.getenv("MQTT_TOPIC", "pixkit/geoinfo")
client_id = f'subscribe-{random.randint(0, 100)}'
ttl_message = timedelta(seconds=float(os.getenv("MQTT_TTL_MESSAGE", 1.5)))

# Generate a Client ID with the subscribe prefix.
username = os.getenv("MQTT_USERNAME", "openlab")
password = os.getenv("MQTT_PASSWORD", "12345")

class MQTTSubscriber:

    def __init__(self):
        self.last_message = (None, None)

    def connect_mqtt(self) -> mqtt_client:
        def on_connect(client, userdata, flags, rc):
            if rc == 0:
                print(f"Connected to MQTT Broker! ({broker}:{port})")
            else:
                print("Failed to connect, return code %d\n", rc)

        print(f"Connecting to MQTT Broker: {broker}:{port}")
        client = mqtt_client.Client(mqtt_client.CallbackAPIVersion.VERSION1, client_id)
        client.username_pw_set(username, password)
        client.on_connect = on_connect
        client.connect(broker, port)
        return client


    def subscribe(self, client: mqtt_client):
        def on_message(client, userdata, msg):
            try:
                message = json.loads(msg.payload.decode())
                self.last_message = (message, datetime.now() + ttl_message)
            except json.JSONDecodeError:
                print("Invalid JSON received:", msg.payload.decode())
                print(msg.payload)
            

        client.subscribe(topic)
        client.on_message = on_message


    def run(self):
        client = self.connect_mqtt()
        self.subscribe(client)
        client.loop_start()  # Non-blocking

