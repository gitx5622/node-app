const { Client } = require('pg')

const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
})
client.connect()
.then(() => console.log("Connected to the database"))
.catch(err => console.log("Could not connect to the database", err))


module.exports = client;