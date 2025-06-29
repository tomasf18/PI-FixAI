
# Sensors Process

## Build

```bash
docker build -t sensors-process .
```

## Run

```bash
docker run --env-file .env -it -v $(pwd)/clips:/app/clips sensors-process
```

## Save the image

> `sensors-process` is the name of the image.
```bash
docker save -o sensors-process.tar sensors-process
```

## Load the image

> `sensors-process` is the name of the created image.
```bash
docker load -i sensors-process.tar
```

<!-- scp .env nap@192.168.1.134:/home/nap/pi-incidents -->
