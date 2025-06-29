# Sensors Process Unit

Inside the`/src` directory.

> Build docker image with name `sensors-process`
```bash
docker build -t sensors-process .
```

> Run docker image
```bash
docker run -it --env-file .env sensors-process
```