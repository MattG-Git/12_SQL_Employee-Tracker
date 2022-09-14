//requiring dependencies
const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');


//let sql;

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MYSQL Password
    password: '',
    database: 'team_db'
  },
  console.log(`Connected to the team_db database.`)
);

db.connect(err => {
    if(err) throw err;
    mainMenu(); 
});

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
    }).then((response) => {
        //this switch statement iterates over selections
        switch (response.start) {
            case 'View All Employees':
                    viewEmployees(); 
                break;
            //add employee
            case 'Add Employee':
                    addEmployee();
                break;
            
            case 'Update Employee Role':
                    updateRole();
                break;

            case 'View All Roles':
                sql = `SELECT roles.id, roles.title, departments.id AS departments, roles.salary, department_id FROM roles JOIN departments ON department_id = departments.id`;
                db.query(sql, (err, rows) => {
                    if (err) {
                    console.log("Error");
                    return;
                    }
                    viewRoles(rows);
                });
                break;

            case 'Add Role' :
                newRole();
                break;

            case 'View All Departments' :
                sql = `SELECT * FROM departments`;
                db.query(sql, (err, rows) => {
                    if (err) {
                    console.log("Error");
                    return;
                    }
                    viewDepartments(rows);
                });
                viewDepartments();
                break;

            case 'Add Department' :
                newDepartment();
                break;

                default:
                    console.log('Something went wrong')
                    mainMenu();
        }
    });
}

function viewDepartments(data) {
   console.table(data);
    mainMenu();
}

function viewEmployees() {
    let sql = 'SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name AS departments, roles.salary AS salary, concat(managers.first_name, \' \', managers.last_name) AS manager FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employees as managers ON managers.id = employees.manager_id';

    db.query(sql, (err, data) => {
        if (err) throw err; 
        console.table(data); 
        mainMenu();
    });
} 

function viewRoles(data) {
    console.table(data);
    mainMenu();
}

// Adds a new employee
function addEmployee() {
    db.query('SELECT id, title FROM roles', (err, response) => {
        if (err) throw err;
        const aRoles = response;
        const roleNames = aRoles.map(role => role.title);
        // test data is connecting console.log(aRoles, roleNames);
    
    db.query('SELECT id, first_name, last_name FROM employees', (err, response) => {
        if (err) throw err;
        const employees = response;
        let employeeNames = employees.map(employee => employee.first_name + ' ' + employee.last_name);

            employeeNames.push('N/A');
        
        inquirer.prompt([
            {
                name: 'fName',
                type: 'input',
                message: 'What is the employee\'s first name?',
                validate: (d) => {
                    if (d) {
                        return true;
                    } else {
                        console.log('Please add the employee\'s first name')
                    }
                }
            },
            {
                name: 'lName',
                type: 'input',
                message: 'What is the employee\'s last name?',
                validate: (d) => {
                    if (d) {
                        return true;
                    } else {
                        console.log('Please enter the employee\'s last name')
                    }
                }
            }, 
            {
                name: 'role',
                type: 'list',
                message: 'What is the employee\'s role?',
                choices: roleNames,
                validate: (d) => {
                    if (d) {
                        return true;
                    } else {
                        console.log('Please enter the employee\'s role')
                    }
                }
            },
            {
                name:'management',
                type: 'list',
                message: 'Who is the employee\'s manager?',
                choices: employeeNames,
                validate: (d) => {
                    if (d) {
                        return true;
                    } else {
                        console.log('Please enter the employee\'s manager')
                    }
                }   
            }
        ])
            .then(data => {
                sql = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                const roleId = aRoles
                    .filter(role => role.title === data.role)
                    .map(role => role.id);

                let managerId;
                if (data.manager === 'N/A') {
                    managerId = null;
                } else {
                    managerId = employees
                        .filter(employee => (employee.first_name + ' ' + employee.last_name) === data.management)
                        .map(management => management.id);
                }

                db.query(sql, [data.fName, data.lName, roleId, managerId], (err, results) => {
                    if (err) throw err;
                    console.log("You've added a new employee");
                    mainMenu();
                });
            });
        });
    });
}


// updates employee's role 
function updateRole() {


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
    ]) 

}

function newDepartment () {

}

