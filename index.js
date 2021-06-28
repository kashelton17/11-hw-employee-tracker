const inq = require('inquirer')
const query = require('./lib/js/query.js')

const questions = ['View all employees', 'View all employees by department', 'View all employees by role', 'Add employee', 'Add department', 'Add role', 'Update employee role', 'Udate employee manager', 'Remove employee', 'Remove department', 'Remove role', 'Exit']

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
                getQuestions()
            } else if (answer.choice === 'View all employees by department'){
                query2
            } else if (answer.choice === 'View all employees by role'){
                query3
            } else if (answer.choice === 'Add employee'){
                query4
            } else if (answer.choice === 'Add department'){
                query5
            } else if (answer.choice === 'Add role'){
                query6
            } else if (answer.choice === 'Update employee role'){
                query7
            } else if (answer.choice === 'Update employee role'){
                query8
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

getQuestions()