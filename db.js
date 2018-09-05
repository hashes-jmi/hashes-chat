let { Pool } = require("pg");

let pool = new Pool({
    user: 'faraaz',
    database: 'chat',
    password: "skffs7461010",
    port: 5432,
});

pool.query('select * from messages', (err, res) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log(res);
    }
});