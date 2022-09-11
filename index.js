//requiring dependencies
const inquirer = require('inquirer');

//this initializes the app and displays main menu
const mainMenu = () => {
    inquirer.prompt({
        name: 'start',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department'
        ]
    }).then((response) =>{
        //this switch statement iterates over selections
        switch (response.start) {
            case 'View All Employees':
            viewEmployees();
                break;

            case 'Add Employee':
                addEmployee();
                break;
            
            case 'Update Employee Role':
                    updateRole();
                    break;

            case 'View All Roles':
                fetch(`/api/roles`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                break;

            case 'Add Role' :
                newRole();
                break;

            case 'View ALl Departments' :
                fetch(`/api/departments`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).then(response => {
                    return response
                })
                break;

            case 'Add Department' :
                newDepartment();
                break;
        }
    });
}
function viewEmployees() {
    fetch(`/employees`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
}

// Adds a new employee
function addEmployee() {
    inquirer.prompt([
        {
            name: 'fName',
            type: 'input',
            message: 'What is the employee\'s first name?'
        },
        {
            name: 'lName',
            type: 'input',
            message: 'What is the employee\'s last name?'
        }, 
        {
            name: 'role',
            type: 'list',
            message: 'What is the employee\'s role?',
            choices: roleNames
        },
        {
            name:'management',
            type: 'list',
            message: 'Who is the employee\'s manager?',
            choices: employeeNames
        }
    ])
};

// updates employee's role 
function updateRole() {
    let eNames = fetch(`/api/employees`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(employees),
    })

    inquirer.prompt([
        {
            name: 'employeeName',
            type: 'list',
            message: 'which employee\'s role do you want to update?',
            choices: eNames
        },
        {
            name: 'assignRole',
            type: 'list',
            message: 'Which role to you want to assign the selected employee?',
            choices: roles
        }
    ])
};

// Adds a new role
function newRole () { 
    inquirer.prompt([
        {
            name: 'roleName',
            type: 'input',
            message: 'What is the name of the role?'
        },
        {
            name: 'roleSalary',
            type: 'input',
            message: 'What is the salary of the role?'
        },
        {
            name: 'assignDepartment',
            type: 'list',
            message: 'Which department does the role belong to?',
            choices: departments
        }
    ]).then(response => {
        fetch(`/api/roles`, {
            method: 'POST', 
            headers: { 
                'title' : response.title, 
                'salary': response.salary,
                'department': response.department,
            },
            body: JSON.stringify(roles),
        })
    } 
    )
}

function newDepartment () {
    inquirer.prompt([
        //prompt for name of department
    ]).then(response => {
        fetch(`/api/departments`, {
            method: 'POST', 
            headers: { 
                'name': response.name 
            },
            body: JSON.stringify(departments),
        })
    } 
    )
}

mainMenu();