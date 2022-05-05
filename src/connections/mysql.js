
require('dotenv').config('../../.env');
const mysql = require('mysql');
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DATABASE } = process.env;


const MySQL = mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASS,
    database: MYSQL_DATABASE
});

MySQL.connect((err) => {
    if (err) throw err;
    console.log({ success: "MySQL Connected" });
});

module.exports = MySQL;