const inq = require('inquirer')
require('console.table')
const mysql = require('mysql');
require('dotenv').config()

const questions = ['View all employees', 'View employees by manager', 'View departments', 'View roles', 'View budget by department', 'Add employee', 'Add department', 'Add role', 'Update employee role', 'Update employee manager', 'Remove employee', 'Remove department', 'Remove role', 'Exit']

var managers
var roles
var depts
var employees

//creating connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// starting connection
connection.connect(function (err) {
    if (err) throw err

    getQuestions()
})

// creating query functions
const viewEmployees = () => {
    const query =  `SELECT employee.id "ID", CONCAT(employee.first_name, " ", employee.last_name) "Name", role.title "Title", department.name "Department", role.salary "Salary", CONCAT(manager.first_name, ' ', manager.last_name) "Manager" FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`
    connection.query(query, (err, res)=> {
        if (err) throw err
        console.table(res)
        startOver()
    })
}

const viewDepartment = () =>{
    const query =  `SELECT id "ID", name 'Department Name' FROM department;`
    connection.query(query, (err, res)=> {
        if (err) throw err
        console.table(res)
        startOver()
    })
}

const viewRole = () =>{
    const query =  `SELECT title 'Title', salary 'Salary', d.name 'Department' FROM role LEFT JOIN department d ON department_id = d.id;`
    connection.query(query, (err, res)=> {
        if (err) throw err
        console.table(res)
        startOver()
    })
}

const addEmployee = (input) =>{
    const query =  `INSERT INTO employee SET ? ;`
    connection.query(query, input, (err, res)=> {
        if (err) throw err
        startOver()
    })
}

const addDepartment = (input) => {
    const query = `INSERT INTO department SET ?;`
    connection.query(query, input, (err, res) => {
        if (err) throw err
        console.log(`succesfully added department ${input.name}`)
        startOver()
    })
}

const addRole = (input) => {
    const query = `INSERT INTO role SET ?;`
    connection.query(query, input, (err, res) => {
        if (err) throw err
        console.log(`succesfully added role ${input.title}`)
        startOver()
    })
}

const updateRole = (input) => {
    const query = `UPDATE employee SET ? WHERE ?;`
    connection.query(query, input, (err, res) => {
        if (err) throw err
        console.log(`Succesfully updated employee role!`)
        startOver()
    })
}

const updateManager = (input) => {
    const query = `UPDATE employee SET ? WHERE ?;`
    connection.query(query, input, (err, res) => {
        if (err) throw err
        console.log('Succesfully updated employee manager!')
        startOver()
    })
}

const removeEmployee = (input) => {
    const query = `DELETE FROM employee WHERE ?;`
    connection.query(query, input, (err, res) => {
        if (err) throw err
        console.log('Succesfully removed employee from database!')
        startOver()
    })
}

const viewByMan = (input) => {
    const query = `SELECT employee.id "ID", CONCAT(employee.first_name, " ", employee.last_name) "Name", role.title "Title", department.name AS Department, role.salary "Salary" FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id WHERE employee.manager_id = ${input.manager_id};`
    connection.query(query, input, (err, res) => {
        if (err) throw err
        console.table(res)
        startOver()
    })
}

const removeDepartment = (input) => {
    const query = `DELETE FROM department WHERE ?;`
    connection.query(query, input, (err, res) => {
        if (err) throw err
        console.log('Succesfully removed department from database!')
        startOver()
    })
}

const removeRole = (input) => {
    const query = `DELETE FROM role WHERE ?;`
    connection.query(query, input, (err, res) => {
        if (err) throw err
        console.log('Succesfully removed role from database!')
        startOver()
    })
}

const viewBudget = (input) => {
    const query = `SELECT d.name "Department", sum(r.salary) "Budget" FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id WHERE r.department_id = ${input.department_id};`
    connection.query(query, input, (req, res) => {
        console.table(res)
        startOver()
    })
}

//creating a loop
const startOver = () => {
    inq 
        .prompt([
            {
                type: 'confirm',
                name: 'exit',
                message: 'Do you want to continue?'
            }
        ])
        .then(answer => {
            if (answer.exit) {
                getQuestions()
            } else {
                console.log('Goodbye')
                process.exit()
            }
        })
}


const getQuestions = () => {

    //getting data that we will use in inquirer prompts
    const query1 = 'SELECT role.id "ID", role.title "Title", role.salary "Salary" FROM role;' 
    connection.query(query1, (err, res)=> {
        if (err) throw err
        roles = res.map(role => ({name: role.Title, value: role.ID}))
    })
    
    const query2 = 'SELECT * from department;'
    connection.query(query2, function (err, res) {
        if (err) throw err
        depts = res.map(dep => ({name: dep.name, value: dep.id}))
      })
    
    const query3 =  'SELECT CONCAT(first_name, " ", last_name) "Name", employee.id "ID" FROM employee LEFT JOIN role ON role_id = role.id WHERE role.title = "Manager";'
    connection.query(query3, (err, res) => {
        if (err) throw err
        managers =  res.map(manager => ({name: manager.Name, value: manager.ID}))
    })

    const query4 = 'SELECT * FROM employee;'
    connection.query(query4, (err, res) => {
        if (err) throw err
        employees = res.map(emp => ({name: `${emp.first_name} ${emp.last_name}`, value: emp.id}))
    })
    //main inq prompts
    inq 
        .prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What do you want to do?',
                choices: questions
            }
        ])
        // after selecting what user wants to do
        .then(answer => {
            console.log(answer.choice)
            if (answer.choice === 'View all employees'){
                viewEmployees()
            } else if (answer.choice === 'View departments'){
                viewDepartments()
            } else if (answer.choice === 'View roles'){
                viewRoles()
            } else if (answer.choice === 'Add employee'){
                let manOptions = managers
                manOptions.push({name: 'None', value: null})
                inq
                    .prompt([
                        {
                            type: 'input',
                            name: 'firstName',
                            message: 'Input employee first name',
                            validate: name => {
                                if (name) {
                                    return true
                                } else {
                                    return 'Please enter valid name'
                                }
                            }
                        },
                        {
                            type: 'input',
                            name: 'lastName',
                            message: 'Input employee last name',
                            validate: name => {
                                if (name) {
                                    return true
                                } else {
                                    return 'Please enter valid name'
                                }
                            }
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
                            choices: manOptions
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
                            message: 'What is the name of the department?',
                            validate: name => {
                                if (name) {
                                    return true
                                } else {
                                    return 'Please enter valid name'
                                }
                            }
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
                            message: 'What is the name of the new role?',
                            validate: name => {
                                if (name) {
                                    return true
                                } else {
                                    return 'Please enter valid role'
                                }
                            }
                        },
                        {
                            type: 'input',
                            name: 'roleSalary',
                            message: 'What is the salary of the role?',
                            validate: salary => {
                                if (salary) {
                                    return true
                                } else {
                                    return 'Please enter valid salary'
                                }
                            }
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
            } else if (answer.choice === 'View employees by manager'){
                inq 
                    .prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Select a manager: ',
                            choices: managers
                        }
                    ])
                    .then(answer => {
                        viewByMan({manager_id: answer.manager})
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
            }  else if (answer.choice === 'Remove department') {
                inq
                .prompt([
                    {
                        type: 'list',
                        name: 'rmDept',
                        message: 'Which department do you want to remove?',
                        choices: depts
                    },
                    {
                        type: 'confirm',
                        name: 'check',
                        message: 'Warning: this action could break the database please confirm no employees or roles rely on this department, do you wish to continue?',
                    }
                ])
                .then(answer => {
                    if (answer.check) {
                        removeDepartment({id: answer.rmDept})
                    }
                })
            } else if (answer.choice === 'Remove role') {
                inq
                .prompt([
                    {
                        type: 'list',
                        name: 'rmRole',
                        message: 'Which role do you want to remove?',
                        choices: roles
                    },
                    {
                        type: 'confirm',
                        name: 'check',
                        message: 'Warning: this action could break the database please confirm no employees rely on this role, do you wish to continue?',
                    }
                ])
                .then(answer => {
                    if (answer.check) {
                        removeRole({id: answer.rmRole})
                    }
                })
            } else if (answer.choice === 'View budget by department') {
                inq
                    .prompt([
                        {
                            type: 'list',
                            name: 'department',
                            message: 'Choose a department to view budget: ',
                            choices: depts
                        }
                    ])
                    .then(answer => {
                        viewBudget({department_id: answer.department})
                    })
            } else if (answer.choice === 'Exit'){
                console.log('Goodbye') 
                process.exit()
            }
        })
}
