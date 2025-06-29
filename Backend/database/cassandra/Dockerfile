FROM cassandra:4.1

# copy CQL scripts to the container
COPY init-scripts/*.cql /docker-entrypoint-initdb.d/

# copy entrypoint script to the container
COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh

# # run the entrypoint script (wait for Cassandra to start, execute CQL scripts)
ENTRYPOINT ["/entrypoint.sh"]
CMD ["cassandra", "-f"]

