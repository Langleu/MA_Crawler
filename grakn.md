in case permissions are missing again:
```
sudo su -
grakn server start
```

or 
`chmod 777 server/service/cassandra/cassandra.yaml`
not suggested!

load the schema
`grakn console --keyspace docker --file src/database/grakn/schema/schema.gql`