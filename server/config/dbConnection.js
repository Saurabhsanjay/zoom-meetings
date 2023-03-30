const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

const mysql = require("mysql");

var connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
});

connection.connect((err) => {
  if (err) throw err;

  console.log(`${DB_NAME} Database Connected successfully`);
});

module.exports = connection;
