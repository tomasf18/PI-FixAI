## How to run:

```bash
docker build -t db_cassandra .
docker run --name database -p 9042:9042 db_cassandra
```

## Play with container:

```bash
docker exec -it deploy-database-cassandra-1 cqlsh
```
