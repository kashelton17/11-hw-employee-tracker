const inq = require('inquirer')
const query = require('./lib/js/query.js')

const questions = ['View all employees', 'View all employees by department', 'View all employees by role', 'Add employee', 'Add department', 'Add role', 'Update employee role', 'Udate employee manager', 'Remove employee', 'Remove department', 'Remove role']

const getQuestions = () => {
    inq 
        .prompt([
            {
                type: 'list',
                name: 'answer',
                message: 'What do you want to do?',
                choices: questions
            },
        ])
        .then(answer => {
            console.log(answer.answer)
        })
}