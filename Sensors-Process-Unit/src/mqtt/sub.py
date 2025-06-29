# python 3.11

import json
import random
from time import sleep

from queue import Queue
from paho.mqtt import client as mqtt_client


broker = '0.0.0.0'
port = 1883
topic = "pixkit/geoinfo"
client_id = f'subscribe-{random.randint(0, 100)}'

# Generate a Client ID with the subscribe prefix.
username = 'openlab'
password = '12345'


def connect_mqtt() -> mqtt_client:
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(mqtt_client.CallbackAPIVersion.VERSION1, client_id)
    client.username_pw_set(username, password)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def subscribe(client: mqtt_client):
    def on_message(client, userdata, msg):
        try:
            message = json.loads(msg.payload.decode())
            print(f"Received `{message}` from `{msg.topic}` topic")

        except json.JSONDecodeError:
            print("Invalid JSON received:", msg.payload.decode())
        

    client.subscribe(topic)
    client.on_message = on_message


def run():
    client = connect_mqtt()
    subscribe(client)
    client.loop_start()  # Blocking

if __name__ == '__main__':
    run()
    print("MQTT subscriber started")
    sleep(1)
    print("MQTT subscriber stopped")