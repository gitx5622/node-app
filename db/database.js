const dbConnection = require("debug")("app:db");
const { Client } = require('pg')
const dotenv = require("dotenv");
dotenv.config();

const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
})
client.connect()
.then(() => dbConnection("Connected to the database"))

module.exports = client;