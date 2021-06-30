DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
	id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee ( 
	id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT DEFAULT NULL,
  primary key (id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Bob', 'Smith', 3, 2), ('Kim', 'Lan', 2, NULL);

INSERT INTO role (title, salary, department_id)
VALUES ('Engineer', 100000, 1), ('Manager', 120000, 2), ('Scientist', 90000, 2);

INSERT INTO department (name)
VALUES ('Engineering'), ('Research and Development');
