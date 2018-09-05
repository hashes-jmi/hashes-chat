let { Pool } = require('pg');

const pool = new Pool({
    user: 'faraaz',
    host: 'localhost',
    database: 'chat',
    password: process.env.PASSWORD,
    port: 5432,
});

function insertQuery(msg) {
    let body = msg.body;
    let sender = msg.sender;
    let timestamp = msg.created_at;

    // TODO: Add code to prevent SQL injection

    let queryString = `insert into messages \
    (body, sender, created_at) \
    values ('${body}', '${sender}', '${timestamp}'); \
    `;

    return queryString;
}

const db = {
    pool: pool, 
    insertQuery: insertQuery
};

module.exports = db;