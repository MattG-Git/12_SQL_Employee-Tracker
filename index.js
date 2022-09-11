const { application } = require("express")


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



function newRole () { 
    
    inquirer.prompt([
        //prompt for name of role
        //prompt for salary 
        //prompt for dept 
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

// function for new employee

// function to update employee role 