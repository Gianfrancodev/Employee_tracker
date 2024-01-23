const inquire = require("inquirer");
const mysql = require("mysql2");
const cfonts = require('cfonts');

const db = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  database: "company_db",
  user: "root",
  password: "",
});
function mainMenu() {
  inquire
    .prompt({
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "Add Department",
        "Add Role",
        "Add Employee",
        "View Departments",
        "View Roles",
        "View Employees",
        "Update Employee Roles",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "Add Department":
          // console.log('Add Department');
          inquire
            .prompt({
              type: "input",
              name: "name",
              message: "What is the name of the department?",
            })
            .then((answerDepartment) => {
              db.query(
                "INSERT INTO department(name) VALUES (?)",
                [answerDepartment.name],
                (err, result) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Department added successfully");
                    mainMenu();
                  }
                }
              );
            });
          break;
        case "Add Role":
          inquire
            .prompt([
              {
                type: "input",
                name: "title",
                message: "What is the title of the role?",
              },
              {
                type: "input",
                name: "salary",
                message: "What is the salary of the role?",
              },
              {
                type: "input",
                name: "department_id",
                message: "What is the department id of the role?",
              },
            ])
            .then((answerRole) => {
              const departmentId = parseInt(answerRole.department_id);

              // Check if the department_id exists in the department table
              db.query(
                "SELECT * FROM department WHERE id = ?",
                [departmentId],
                (deptErr, deptResult) => {
                  if (deptErr) {
                    console.log(deptErr);
                  } else if (deptResult.length === 0) {
                    console.log(
                      "Error: The specified department_id does not exist. Please enter a valid department_id."
                    );
                    mainMenu();
                  } else {
                    // Insert the role into the role table
                    db.query(
                      "INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)",
                      [answerRole.title, answerRole.salary, departmentId],
                      (err, result) => {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log("Role added successfully");
                          mainMenu();
                        }
                      }
                    );
                  }
                }
              );
            });
          break;
        case "Add Employee":
          // console.log('Add Employee');
          inquire
            .prompt([
              {
                type: "input",
                name: "first_name",
                message: "What is the first name of the employee?",
              },
              {
                type: "input",
                name: "last_name",
                message: "What is the last name of the employee?",
              },
              {
                type: "input",
                name: "role_id",
                message: "What is the role id of the employee?",
              },
              {
                type: "input",
                name: "manager_id",
                message: "What is the manager id of the employee?",
              },
            ])
            .then((answerEmployee) => {
              const roleId = parseInt(answerEmployee.role_id);
              const managerId = parseInt(answerEmployee.manager_id);

              // Check if the role_id exists in the role table
              db.query(
                "SELECT * FROM role WHERE id = ?",
                [roleId],
                (roleErr, roleResult) => {
                  if (roleErr) {
                    console.log(roleErr);
                  } else if (roleResult.length === 0) {
                    console.log(
                      "Error: The specified role_id does not exist. Please enter a valid role_id."
                    );
                    mainMenu();
                  } else {
                    // Check if the manager_id exists in the employee table
                    db.query(
                      "SELECT * FROM employee WHERE id = ?",
                      [managerId],
                      (managerErr, managerResult) => {
                        if (managerErr) {
                          console.log(managerErr);
                        } else if (managerResult.length === 0) {
                          console.log(
                            "Error: The specified manager_id does not exist. Please enter a valid manager_id."
                          );
                          mainMenu();
                        } else {
                          // Insert the employee into the employee table
                          db.query(
                            "INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
                            [
                              answerEmployee.first_name,
                              answerEmployee.last_name,
                              roleId,
                              managerId,
                            ],
                            (err, result) => {
                              if (err) {
                                console.log(err);
                              } else {
                                console.log("Employee added successfully");
                                mainMenu();
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            });
          break;
        case "View Departments":
          // console.log('View Departments');
          db.query("SELECT * FROM department", (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.table(result);
              mainMenu();
            }
          });
          break;
        case "View Roles":
          // console.log('View Roles');
          db.query("SELECT * FROM role", (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.table(result);
              mainMenu();
            }
          });
          break;
        case "View Employees":
          // console.log('View Employees');
          db.query("SELECT * FROM employee", (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.table(result);
              mainMenu();
            }
          });
          break;
        case "Update Employee Roles":
          db.query("SELECT * FROM employee", (err, employees) => {
            const employeeChoices = employees.map((employee) => {
              return {
                name: employee.first_name + " " + employee.last_name,
                value: employee.id,
              };
            });

            console.log(employeeChoices);

            db.query("SELECT * FROM role", (err, roles) => {
              const roleChoices = roles.map((role) => {
                return {
                  name: role.title,
                  value: role.id,
                };
              });

              console.log(roleChoices);
              // console.log('Update Employee Roles');
              inquire
                .prompt([
                  {
                    type: "list",
                    name: "employee_id",
                    message: "What is the id of the employee?",
                    choices: employeeChoices,
                  },
                  {
                    type: "list",
                    name: "role_id",
                    message: "What is the id of the role?",
                    choices: roleChoices,
                  },
                ])
                .then((answerUpdate) => {
                  const employeeId = parseInt(answerUpdate.employee_id);
                  const roleId = parseInt(answerUpdate.role_id);

                  // Check if the employee_id exists in the employee table
                  db.query(
                    "SELECT * FROM employee WHERE id = ?",
                    [employeeId],
                    (employeeErr, employeeResult) => {
                      if (employeeErr) {
                        console.log(employeeErr);
                      } else if (employeeResult.length === 0) {
                        console.log(
                          "Error: The specified employee_id does not exist. Please enter a valid employee_id."
                        );
                        mainMenu();
                      } else {
                        // Check if the role_id exists in the role table
                        db.query(
                          "SELECT * FROM role WHERE id = ?",
                          [roleId],
                          (roleErr, roleResult) => {
                            if (roleErr) {
                              console.log(roleErr);
                            } else if (roleResult.length === 0) {
                              console.log(
                                "Error: The specified role_id does not exist. Please enter a valid role_id."
                              );
                              mainMenu();
                            } else {
                              // Update the employee's role in the employee table
                              db.query(
                                "UPDATE employee SET role_id = ? WHERE id = ?",
                                [roleId, employeeId],
                                (err, result) => {
                                  if (err) {
                                    console.log(err);
                                  } else {
                                    console.log(
                                      "Employee role updated successfully"
                                    );
                                    mainMenu();
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                });
            });
          });

          break;
        case "Exit":
          // console.log('Exit');
          process.exit();
          break;
        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
}

mainMenu();
