CREATE TABLE users 
(
    userId INTEGER PRIMARY KEY,
    email TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    studentId INTEGER,
    isEmailVerified BOOL NOT NULL
);