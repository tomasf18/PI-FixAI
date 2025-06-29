#!/bin/bash
set -e

# Start Cassandra (using the official entrypoint) in the background
/usr/local/bin/docker-entrypoint.sh cassandra -f &

# Wait for Cassandra to be available
echo "Waiting for Cassandra to start..."
until cqlsh -e 'describe keyspaces' > /dev/null 2>&1; do
    echo "Trying to connect..."
    sleep 5
done

# Execute each CQL init script found in the directory
echo "Cassandra is ready. Applying CQL scripts..."

cqlsh -f "/docker-entrypoint-initdb.d/init-keyspace.cql"

echo "✅ All keyspaces created. Applying init schema..."

cqlsh -f "/docker-entrypoint-initdb.d/init-schema.cql"

echo "✅ All scripts applied. Initiating seed data..."

cqlsh -f "/docker-entrypoint-initdb.d/init-seed.cql"

echo "✅ Seed data applied. Cassandra is ready!"

# Foreground mode is required for the container to stay alive
# Otherwise, it will stop immediately after the entrypoint script finishes
wait -n

