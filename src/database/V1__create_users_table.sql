CREATE TABLE users 
(
    userID INTEGER PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    studentId INTEGER NOT NULL,
    isEmailVerified BIT NOT NULL,
);