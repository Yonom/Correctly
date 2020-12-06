DROP TABLE IF EXISTS users;

CREATE TABLE users 
(
    userId VARCHAR(64) PRIMARY KEY,
    email VARCHAR(64) NOT NULL,
    firstName VARCHAR(64) NOT NULL,
    lastName VARCHAR(64) NOT NULL,
    studentId INTEGER,
    isEmailVerified BOOL NOT NULL
);