## Install Mosquitto

```bash
sudo apt update
sudo apt install -y mosquitto
```

## Create user in MQTT

> Create a new password file and add user "openlab". 

```bash
sudo mosquitto_passwd -c /etc/mosquitto/passwd openlab
```

## Change permissions

```bash
sudo chown root:mosquitto /etc/mosquitto/passwd
sudo chmod 640 /etc/mosquitto/passwd
```

## Stop mosquitto broker

```bash
sudo systemctl stop mosquitto
```

## Start mosquitto broker

```bash
sudo mosquitto -c ./mosquitto.conf
```
