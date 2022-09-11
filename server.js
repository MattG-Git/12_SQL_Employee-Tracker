const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

// view all departments
app.get('/api/departments', (req, res) => {
  const sql = `SELECT * FROM departments`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// view all roles
app.get('/api/roles', (req, res) => {
  const sql = `SELECT roles.id, roles.title, department.id AS departments, roles.salary, department_id FROM roles JOIN department ON department_id = departments.id`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// view all employees
app.get('/api/employees', (req, res) => {
  const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary AS salary, concat(managers.first_name, \' \', managers.last_name) AS manager FROM employee JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employees as managers ON mangers.id = employee.manager_id`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });