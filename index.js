const inq = require('inquirer')
require('console.table')
const mysql = require('mysql');
require('dotenv').config()

const questions = ['View all employees', 'View departments', 'View roles', 'Add employee', 'Add department', 'Add role', 'Update employee role', 'Update employee manager', 'Remove employee', 'Remove department', 'Remove role', 'Exit']

var managers
var roles
var depts
var employees

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.connect(function (err) {
    if (err) throw err

    const query1 = 'SELECT roles.id "ID", roles.title "Title", roles.salary "Salary" FROM roles;' 
    connection.query(query1, (err, res)=> {
        if (err) throw err
        roles = res.map(role => ({name: role.Title, value: role.ID}))
    })
    
    const query2 = 'SELECT * from departments;'
    connection.query(query2, function (err, res) {
        if (err) throw err
        depts = res.map(dep => ({name: dep.name, value: dep.id}))
      })
    
    const query3 =  'SELECT CONCAT(first_name, " ", last_name) "Name", employees.id "ID" FROM employees LEFT JOIN roles ON role_id = roles.id WHERE roles.title = "Manager";'
    connection.query(query3, (err, res) => {
        if (err) throw err
        managers =  res.map(manager => ({name: manager.Name, value: manager.ID}))
    })

    const query4 = 'SELECT * FROM employees;'
    connection.query(query4, (err, res) => {
        if (err) throw err
        employees = res.map(emp => ({name: `${emp.first_name} ${emp.last_name}`, value: emp.ID}))
    })

    getQuestions()
})


const viewEmployees = () => {
    const query =  `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments on roles.department_id = departments.id LEFT JOIN employees manager on manager.id = employees.manager_id;`
    connection.query(query, (err, res)=> {
        if (err) throw err
        console.table(res)
        startOver()
    })
}

const viewDepartments = () =>{
    const query =  `SELECT name 'Department Name' FROM departments;`
    connection.query(query, input, (err, res)=> {
        if (err) throw err
        console.table(res)
        startOver()
    })
}

const viewRoles = () =>{
    const query =  `SELECT title 'Title', salary 'Salary', d.name 'Department' FROM roles LEFT JOIN departments d ON department_id = d.id;`
    connection.query(query, input, (err, res)=> {
        if (err) throw err
        console.table(res)
        startOver()
    })
}

const addEmployee = (input) =>{
    const query =  `INSERT INTO employees SET ? ;`
    connection.query(query, input, (err, res)=> {
        if (err) throw err
        console.table(res)
        startOver()
    })
}

const addDepartment = (input) => {
    const query = `INSERT INTO departments SET ?;`
    connection.query(query, input, (err, res) => {
        if (err) throw err
        console.log(`succesfully added department ${input}`)
        startOver()
    })
}

const addRole = (input) => {
    const query = `INSERT INTO roles SET ?;`
    connection.query(query, input, (err, res) => {
        if (err) throw err
        console.log(`succesfully added role ${input.title}`)
        startOver()
    })
}

const updateRole = (input) => {
    const query = `UPDATE employees SET ? WHERE ?;`
    connection.query(query, input, (err, res) => {
        if (err) throw err
        console.log(`Succesfully updated employee role!`)
        startOver()
    })
}

const updateManager = (input) => {
    const query = `UPDATE employees SET ? WHERE ?;`
    connection.query(query, input, (err, res) => {
        if (err) throw err
        console.log('Succesfully updated employee manager!')
        startOver()
    })
}

const removeEmployee = (input) => {
    const query = `DELETE FROM employees WHERE ?;`
    connection.query(query, input, (err, res) => {
        if (err) throw err
        console.log('Succesfully removed employee from database!')
        startOver()
    })
}

const startOver = () => {
    inq 
        .prompt([
            {
                type: 'confirm',
                name: 'exit',
                message: 'Do you want to continue'
            }
        ])
        .then(answer => {
            if (answer.exit) {
                getQuestions()
            } else {
                console.log('goodBye')
                process.exit()
            }
        })
}


const getQuestions = () => {
    inq 
        .prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What do you want to do?',
                choices: questions
            }
        ])
        .then(answer => {
            console.log(answer.choice)
            if (answer.choice === 'View all employees'){
                viewEmployees()
            } else if (answer.choice === 'View departments'){
                viewDepartments()
            } else if (answer.choice === 'View roles'){
                viewRoles()
            } else if (answer.choice === 'Add employee'){
                inq
                    .prompt([
                        {
                            type: 'input',
                            name: 'firstName',
                            message: 'Input employee first name'
                        },
                        {
                            type: 'input',
                            name: 'lastName',
                            message: 'Input employee last name'
                        },
                        {
                            type: 'list',
                            name: 'chosenRole',
                            message: 'Choose a role',
                            choices: roles
                        },
                        {
                            type: 'list',
                            name: 'chosenManager',
                            message: 'Choose a Manager',
                            choices: managers
                        }
                    ])
                    .then(answers => {
                        const object = {first_name: answers.firstName, last_name: answers.lastName, role_id: answers.chosenRole, manager_id: answers.chosenManager}
                        addEmployee(object)
                    })
            } else if (answer.choice === 'Add department'){
                inq
                    .prompt([
                        {
                            type: 'input',
                            name: 'dept',
                            message: 'What is the name of the department?'
                        }
                    ])
                    .then(answer => {
                        addDepartment({ name: answer.dept})
                    })
            } else if (answer.choice === 'Add role'){
                inq 
                    .prompt([
                        {
                            type: 'input',
                            name: 'roleTitle',
                            message: 'What is the name of the new role?'
                        },
                        {
                            type: 'input',
                            name: 'roleSalary',
                            message: 'What is the salary of the role?'
                        },
                        {
                            type: 'list',
                            name: 'roleDept',
                            message: 'What is the department?',
                            choices: depts
                        }
                    ])
                    .then(answers => {
                        addRole({title: answers.roleTitle, salary: answers.roleSalary, department_id: answers.roleDept})
                    })
            } else if (answer.choice === 'Update employee role'){
                inq
                    .prompt([
                        {
                            type: 'list',
                            name: 'updateE',
                            message: 'Choose employee to update',
                            choices: employees
                        },
                        {
                            type: 'list',
                            name: 'newRole',
                            message: 'Select a role',
                            choices: roles
                        }
                    ])
                    .then(answers => {
                        updateRole([{role_id: answers.newRole}, {id: answers.updateE}])
                    })
            } else if (answer.choice === 'Update employee manager'){
                inq
                .prompt([
                    {
                        type: 'list',
                        name: 'updateE',
                        message: 'Choose employee to update',
                        choices: employees
                    },
                    {
                        type: 'list',
                        name: 'newManager',
                        message: 'Select a new Manager',
                        choices: managers
                    }
                ])
                .then(answers => {
                    updateManager([{manager_id: answers.newManager}, {id: answers.updateE}])
                })
            } else if (answer.choice === 'Remove employee'){
                inq
                    .prompt([
                        {
                            type: 'list',
                            name: 'rmEmployee',
                            message: 'Which employee do you want to remove?',
                            choices: employees
                        }
                    ])
                    .then(answer => {
                        removeEmployee({id: answer.rmEmployee})
                    })
            } else if (answer.choice === 'View employees by manager'){
                query11
            } else if (answer.choice === 'Remove department') {
                query12
            } else if (answer.choice === 'Remove role') {
                query12
            } else if (answer.choice === 'Exit'){
                console.log('Goodbye') 
                process.exit()
            }
        })
}
