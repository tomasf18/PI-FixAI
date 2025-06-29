# Tests

From the root of your project (../Tests) you can run the tests using the following command so that the environment variables are loaded from the `.env` file:

```bash
export $(grep -v '^#' .env | xargs) && k6 run --out=experimental-prometheus-rw website/get_photo_id/test_get_photo_id.js
```

## Open dashboard

You can open the dashboard in `http://127.0.0.1:3000`.
