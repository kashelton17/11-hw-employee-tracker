const mysql = require('mysql');
require('dotenv').config()
var managers = []
var roles = []

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

const query1 = 'SELECT title, id FROM roles' 
connection.query(query1, async (err, res)=> {
    if (err) throw err
    roles = await res.map(role => ({ title: role.title, id: role.id }))
    return roles
})


const query2 =  'SELECT CONCAT(first_name, " ", last_name) "Name", employees.id "ID" FROM employees LEFT JOIN roles ON role_id = roles.id WHERE roles.title = "Manager";'
connection.query(query2, async (err, res) => {
    if (err) throw err
    managers = await res.forEach(manager => ({name: manager.Name, id: manager.ID}))
    return managers
})

const viewEmployees = () => {
    const query =  `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments on roles.department_id = departments.id LEFT JOIN employees manager on manager.id = employees.manager_id;`
    connection.query(query, (err, res)=> {
        if (err) throw err
        console.table(res)
    })
}

const viewDepartments = () =>{
    const query =  `SELECT name 'Department Name' FROM departments;`
    connection.query(query, input, (err, res)=> {
        if (err) throw err
        console.table(res)
    })
}

const viewRoles = () =>{
    const query =  `SELECT title 'Title', salary 'Salary', d.name 'Department' FROM roles LEFT JOIN departments d ON department_id = d.id;`
    connection.query(query, input, (err, res)=> {
        if (err) throw err
        console.table(res)
    })
}

const addEmployee = (input) =>{
    const query =  `INSERT INTO employees SET ? ;`
    connection.query(query, input, (err, res)=> {
        if (err) throw err
        console.table(res)
    })
}

const addDepartment = (input) => {
    const query = `INSERT INTO departments SET ?;`
    connection.query(query, input, (err, res) => {
        if (err) throw err
        console.log(`succesfully added department ${input}`)
    })
}

const addRole = (input) => {
    const query = `INSERT INTO roles SET ?;`
    connection.query(query, input, (err, res) => {
        if (err) throw err
        console.log(`succesfully added role ${input.title}`)
    })
}

const updateRole = (input) => {
    const query = `UPDATE employees SET ? WHERE ?`
    connection.query(query, input, (err, res) => {
        if (err) throw err
        console.log(`Succesfully updated employee role to ${input.role}`)
    })

}

module.exports = { viewEmployees, viewDepartments, viewRoles, addEmployee, managers, roles, addDepartment, addRole, connection, updateRole }
