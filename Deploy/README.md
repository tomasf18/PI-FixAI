# Deploy setup

### Clone repositories
```bash
./clone-reps.sh
```

## Backend setup

#### Api-Services

Change `.env` file to enable HTTPs:

```bash
NGINX_LOCAL_PORT=443
NGINX_CONTAINER_PORT=443
HTTPS_ENABLED=true
```

#### Nginx

Change `conf.d/default.conf` file to enable HTTPs with respective domain (uncomment the following lines):

```nginx
listen 443 ssl;
server_name pedropinto.info;

ssl_certificate certs/domain.cert.pem;
ssl_certificate_key certs/private.key.pem; 
```

## Website setup

Inside the `/Website/frontend` directory. Change `.env` file to enable HTTPs:

```bash
VITE_BACKEND_HOST=pedropinto.info
VITE_BACKEND_PORT=443
VITE_BACKEND_PROTOCOL=https
```

**Note:** For production you should also change the `electron.cjs` file to start the app using local build, instead of the dev server. Changing also the `./start.sh`.

## Mobile setup

Inside the `/Mobile/src` directory. Change `app.json` file:

```bash
"API_BASE_URL": "https://pedropinto.info/api/v1"
```

