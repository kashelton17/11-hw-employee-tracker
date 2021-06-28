const mysql = require('mysql');
require('dotenv').config()

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

const viewEmployees = () => {
    const query =  `SELECT CONCAT(e.first_name, ' ', e.last_name) name , r.title title, 
    IF(e.manager_id IS NOT NULL, e.manager_id, 'None') manager 
    FROM employee_db.employees e
    JOIN employee_db.roles r ON role_id = r.id
    LEFT JOIN employee_db.employees m ON e.manager_id = m.id;`
    connection.query(query, (err, res)=> {
        if (err) throw err
        console.table(res)
    })
    connection.end();
}

module.exports = { viewEmployees }
