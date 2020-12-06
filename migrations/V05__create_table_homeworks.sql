DROP TABLE IF EXISTS homeworks,refers,reviews;
CREATE TABLE homeworks 
(
    id SERIAL PRIMARY KEY,
    exercise BYTEA NOT NULL,
    exerciseFileType VARCHAR(64) NOT NULL,
    solution BYTEA NOT NULL,
    solutionFileType VARCHAR(64) NOT NULL,
    evaluation BYTEA,
    evaluationFileType VARCHAR(64),
    doingStart TIMESTAMP NOT NULL,
    doingEnd TIMESTAMP NOT NULL,
    correctingStart TIMESTAMP NOT NULL,
    correctingEnd TIMESTAMP NOT NULL,
    dataFormat VARCHAR(64)[] NOT NULL,
    correctingType VARCHAR(64) NOT NULL,
    correctingAmountStudent INTEGER NOT NULL,
    correctingAmountProf INTEGER NOT NULL,
    criticalEvaluation FLOAT NOT NULL
);

CREATE TABLE refers (
    refersId SERIAL PRIMARY KEY,
    homeworksId INTEGER REFERENCES homeworks(id) ON UPDATE CASCADE ON DELETE CASCADE,
    coursesId INTEGER REFERENCES courses(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE reviews (
    reviewsId SERIAL PRIMARY KEY,
    homeworksId INTEGER REFERENCES homeworks(id) ON UPDATE CASCADE ON DELETE CASCADE,
    usersId VARCHAR(64) REFERENCES users(userId) ON UPDATE CASCADE ON DELETE CASCADE,
    coursesId INTEGER REFERENCES courses(id) ON UPDATE CASCADE ON DELETE CASCADE
);