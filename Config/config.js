const mysql = require("mysql");

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    pass: "",
    database: "chat sistemi"
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Mysql Connected");
    }
});

module.exports = db;
