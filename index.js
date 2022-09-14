//requiring dependencies
const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');


let sql;

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

//this starts the app only if the connection to the db is successful
db.connect(err => {
    if(err) throw err;
    console.log('\x1b[1;32m%s\x1b[0m', 'WELCOME TO EMPLOYEE MANAGER ');    
    mainMenu(); 
});

//this initializes the app and displays main menu
const mainMenu = () => {
    inquirer.prompt({
        name: 'start',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add Department',
            'Add Role',
            'Add Employee',
            'Update Employee Role'
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

            case 'View All Departments':
                sql = `SELECT * FROM departments`;
                db.query(sql, (err, rows) => {
                    if (err) {
                    console.log("Error");
                    return;
                    }
                    viewDepartments(rows);
                });
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

//puts data into a console.table to view all departments
function viewDepartments(data) {
   console.table(data);
    mainMenu();
}

//function allows user to view all employees
function viewEmployees() {
    //sql query to grab all employees from the db
    sql = 'SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name AS departments, roles.salary AS salary, concat(managers.first_name, \' \', managers.last_name) AS manager FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employees as managers ON managers.id = employees.manager_id';
    //makes the query and puts the data into a console.table
    db.query(sql, (err, data) => {
        if (err) throw err; 
        console.table(data); 
        mainMenu();
    });
} 
//puts data into a console.table to view all roles
function viewRoles(data) {
    console.table(data);
    mainMenu();
}

// function allows a user to add a new employee to the db
function addEmployee() {
    //sql query that grabs all roles from the db and stores them within an array within a variable that inquirer can use for choices further down in the code
    db.query('SELECT id, title FROM roles', (err, response) => {
        if (err) throw err;
        const aRoles = response;
        const roleNames = aRoles.map(role => role.title);
        // test data is connecting console.log(aRoles, roleNames);
    
    //sql query that grabs all employees from the db and stores them within an array within a variable that inquirer can use for choices further down in the code
    db.query('SELECT id, first_name, last_name FROM employees', (err, response) => {
        if (err) throw err;
        const employees = response;
        let employeeNames = employees.map(employee => employee.first_name + ' ' + employee.last_name);
            //this allows the user to select no manager if they lead a department
            employeeNames.push('None');
        
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
            },
            {
                name:'management',
                type: 'list',
                message: 'Who is the employee\'s manager?',
                choices: employeeNames,  
            }
        ])
            .then(data => {
                //sql query that maps user input to variables that are inserted in to the db
                sql = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                const roleId = aRoles
                    .filter(role => role.title === data.role)
                    .map(role => role.id);

                let managerId;
                if (data.manager === 'None') {
                    return managerId = null;
                } else {
                    managerId = employees
                        .filter(employee => (employee.first_name + ' ' + employee.last_name) === data.management)
                        .map(management => management.id);
                }

                db.query(sql, [data.fName, data.lName, roleId, managerId], (err, response) => {
                    if (err) throw err;
                    console.log('You\'ve added a new employee');
                    mainMenu();
                });
            });
        });
    });
}


// This function allows the user to update the role of an employee
function updateRole() {
    //sql query that grabs all employees from the db and stores them within an array within a variable that inquirer can use for choices further down in the code
    db.query('SELECT id, first_name, last_name FROM employees', (err, response) => {
        if (err) throw err;
        const employees = response;
        let employeeNames = employees.map(employee => employee.first_name + ' ' + employee.last_name);

        //sql query that grabs all roles from the db and stores them within an array within a variable that inquirer can use for choices further down in the code
    db.query('SELECT id, title FROM roles', (err, response) => {
        if (err) throw err;
        const roles = response;
        const roleNames = roles.map(role => role.title);

    inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                message: 'which employee\'s role do you want to update?',
                choices: employeeNames
            },
            {
                name: 'role',
                type: 'list',
                message: 'Which role to you want to assign the selected employee?',
                choices: roleNames
            }
            ]).then(data => {
                //sql query that updates employee role in the db
                sql = 'UPDATE employees SET role_id = ? WHERE id = ?';
                const employeeId = employees
                    .filter(employee => (employee.first_name + ' ' + employee.last_name) === data.employee)
                    .map(employee => employee.id);
                const roleId = roles
                    .filter(role => role.title === data.role)
                    .map(role => role.id);
                db.query(sql, [roleId, employeeId], (err, response) => {
                    if (err) throw err;
                    console.log('You\'ve updated the employee\'s role.');
                    mainMenu();
                });
            });
        });
    });
}

// function allows user to add a new role to the db
function newRole () { 
    db.query('SELECT * FROM departments', (err, response) => {
        if (err) throw err;
        const departments = response;
        const departmentNames = departments.map(department => department.department_name);
       // console.log(departmentNames)

        inquirer.prompt([
            {
                name: 'role',
                type: 'input',
                message: 'What is the name of the role?',
                validate: (value) => {
                    if (value) {
                        return true;
                    } else {
                        console.log('Invalid input, please add the name of the role');
                    }
                }
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary for this role?',
                validate: (value) => {
                    if (value) {
                        return true;
                    } else {
                        console.log('Invalid input, please add the salary for this role');
                    }
                }
            },
            {
                name: 'department',
                type: 'list',
                message: 'What department does this role belong to?',
                choices: departmentNames
            }
        ]).then(data => {
            //sql query that inserts new role into the db
            sql = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
            const departmentId = departments
                .filter(department => department.department_name === data.department)
                .map(department => department.id);
            db.query(sql, [data.role, parseInt(data.salary), departmentId], (err, response) => {
                if (err) throw err;
                console.log('You\'ve added a new role');
                mainMenu();
            });
        });
    });

}

//function allows user to add a new department to the db
function newDepartment () {
    inquirer.prompt([
        {
            name: 'department',
            type: 'input',
            message: 'What is the name of the new department?',
            validate: (value) => {
                if (value) {
                    return true;
                } else {
                    console.log('Invalid input, please add the name of the new department');
                }
            }
        }
    ]).then(data => {
        //sql query that inserts new department into the db
        sql = 'INSERT INTO departments (department_name) VALUES (?)';
        db.query(sql, data.department, (err, response) => {
            if (err) throw err;
            console.log('You\'ve added a new department.');
            mainMenu();
        });
    });
}

