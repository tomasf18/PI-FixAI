# MinIO setup with docker

# start docker:

```bash
mkdir -p ./data

docker run \
   -p 9000:9000 \
   -p 9001:9001 \
   --name minio \
   -v ./data:/data \
   -e "MINIO_ROOT_USER=admin123" \
   -e "MINIO_ROOT_PASSWORD=admin123" \
   quay.io/minio/minio server /data --console-address ":9001"
```

