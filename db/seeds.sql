-- Seed your database with initial data here.
USE company_db;


-- set up departments
INSERT INTO department (name)  VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Legal');
-- set up roles 
INSERT INTO role (title, salary, department_id) VALUES 
('Sales Lead', 100000, 1),
('Salesperson', 80000, 1),
('Lead Engineer', 150000, 2),
('Software Engineer', 120000, 2),
('Accountant', 125000, 3),
('Legal Team Lead', 250000, 4),
('Lawyer', 190000, 4);

-- set up employees 
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL),
('Ousmane', 'Dembele', 2, 1),
('Diego', 'Maradona', 3, 1),
('Phil', 'Foden', 4, 1),
('Bukayo', 'Saka', 5, 1),
('George', 'New', 6, 1),
('Kevin', 'Cummings', 7, 1),
('Luke', 'Baer', 1, 1),
('Juan', 'Pabe', 4, 1),
('Jane', 'Doe', 1, NULL),
('Cristiano', 'Ronaldo', 2, 10),
('Lionel', 'Messi', 3, 10),
('Kylian', 'Mbappe', 4, 10),
('Kevin', 'DeBruyne', 5, 10),
('Luka', 'Modric', 3, 10),
('Gareth', 'Bale', 6, 10),
('Gianfranco', 'De Vettori', 7, 10),
('Harry', 'Kane', 1, 10),
('Vinicius', 'Junior', 2, 1),
('Erling', 'Haaland', 3, 1)