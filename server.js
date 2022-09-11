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
  const sql = `SELECT roles.id, roles.title, departments.id AS departments, roles.salary, department_id FROM roles JOIN departments ON department_id = departments.id`;
  
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
  const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name AS departments, roles.salary AS salary, concat(managers.first_name, \' \', managers.last_name) AS manager FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employees as managers ON managers.id = employees.manager_id`;
  
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

//add department
app.post('/api/departments', ({ body }, res) => {
  const sql = `INSERT INTO departments (department_name)
    VALUES (?)`;
  const params = [body.department_name];
  
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

//add role
app.post('/api/roles', ({ body }, res) => {
  const sql = `INSERT INTO roles (title, salary, department_id)
    VALUES (?, ?, ?)`;
  const params = [body.title, body.salary, body.department_id];
  
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

//add employee
app.post('/api/employees', ({ body }, res) => {
  const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)`;
  const params = [body.first_name, body.last_name, body.role_id, body.manager_id];
  
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

//update employee role
app.put('/api/employees/:id', (req, res) => {
  const sql = `UPDATE role_id SET role_id = ? WHERE id = ?`;
  const params = [req.body.role_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Employee not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });