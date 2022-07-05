
require('dotenv').config('../../.env');
const mysql = require('mysql');
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DATABASE } = process.env;


const ConnectionMySQL = mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASS,
    database: MYSQL_DATABASE
});

ConnectionMySQL.connect((err: Error) => {
    if (err) throw err;
    console.log({ success: "MySQL Connected" });
});

export default ConnectionMySQL;