const inq = require('inquirer')
const query = require('./lib/js/query.js')

const questions = ['View all employees', 'View departments', 'View roles', 'Add employee', 'Add department', 'Add role', 'Update employee role', 'Udate employee manager', 'Remove employee', 'Remove department', 'Remove role', 'Exit']

const getQuestions = () => {
    inq 
        .prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What do you want to do?',
                choices: questions
            },
        ])
        .then(answer => {
            console.log(answer.choice)
            if (answer.choice === 'View all employees'){
                query.viewEmployees()
                startOver()
            } else if (answer.choice === 'View departments'){
                query.viewDepartments()
                    (startOver())
            } else if (answer.choice === 'View roles'){
                query.viewRoles()
                    (startOver())
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
                            choices: query.showroles
                        },
                        {
                            type: 'list',
                            name: 'chosenManager',
                            message: 'Choose a Manager',
                            choices: query.showemployees
                        }
                    ])
                    .then(answers => {
                        const object = {first_name: answers.firstName, last_name: answers.lastName, role_id: answers.chosenRole.ID, manager_id: answers.chosenManager.ID}
                        query.addEmployee(object)
                        startOver()
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
                        query.addDepartment({ name: answer.dept})
                        startOver()
                    })
            } else if (answer.choice === 'Add role'){
                inq 
                    .prompt([
                        {
                            type: 'input',
                            name: 'roleTitle',
                            message: 'What is the name of the role?'
                        },
                        {
                            type: 'input',
                            name: 'roleSalary',
                            message: 'What is the salary of the role?'
                        },
                        {
                            type: 'input',
                            name: 'roleDept',
                            message: 'What is the department id?'
                        }
                    ])
                    .then(answers => {
                        query.addRole({title: answers.roleTitle, salary: answers.roleSalary, department_id: answers.roleDept})
                        startOver()
                    })
            } else if (answer.choice === 'Update employee role'){
                query7
            } else if (answer.choice === 'Update employee manager'){
                query9
            } else if (answer.choice === 'Remove employee'){
                query10
            } else if (answer.choice === 'Update employee manager'){
                query11
            } else if (answer.choice === 'Remove department') {
                query12
            } else if (answer.choice === 'Remove role') {
                query12
            } else if (answer.choice === 'Exit'){
                return 'Goodbye'
            }
        })
}

const startOver = () => {
    inq
        .prompt([
            {
                type: 'list',
                name: 'confirm',
                message: 'Do you want to continue or exit?',
                choices: ['Continue', 'Exit']
            }
        ])
        .then(answer => {
            if (answer === 'Continue') {
                getQuestions()
            } else {
                query.connection.end
                return 'Goodbye'
            }
        })
}

getQuestions()
