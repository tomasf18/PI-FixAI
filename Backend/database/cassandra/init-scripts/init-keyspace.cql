-- SQLBook: Code
CREATE KEYSPACE IF NOT EXISTS Auth WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };
CREATE KEYSPACE IF NOT EXISTS H3_index WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };
CREATE KEYSPACE IF NOT EXISTS App_data WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };
