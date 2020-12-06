DROP TABLE IF EXISTS homeworks,refers,reviews,solutions,reviewAudits;

CREATE TABLE homeworks 
(
    id SERIAL PRIMARY KEY,
    homeworkName  VARCHAR(64) NOT NULL,
    maxReachablePoints INTEGER NOT NULL,
    requireCorrectingDocumentationFile BOOLEAN NOT NULL,
    evaluationVariant VARCHAR(64) NOT NULL,
    correctionVariant VARCHAR(64) NOT NULL,
    correctionValidation VARCHAR(64) NOT NULL,
    samplesize INTEGER NOT NULL,
    threshold INTEGER NOT NULL,
    solutionAllowedFormats VARCHAR(64)[] NOT NULL,
    correctionAllowedFormats VARCHAR(64)[] NOT NULL,
    doingStart TIMESTAMP NOT NULL,
    doingEnd TIMESTAMP NOT NULL,
    correctingStart TIMESTAMP NOT NULL,
    correctingEnd TIMESTAMP NOT NULL,
    exerciseAssignment BYTEA[] NOT NULL,
    modelSolution BYTEA[] NOT NULL,
    evaluationScheme BYTEA[]
);

CREATE TABLE refers (
    refersId SERIAL PRIMARY KEY,
    homeworksId INTEGER REFERENCES homeworks(id) ON UPDATE CASCADE ON DELETE CASCADE,
    coursesId INTEGER REFERENCES courses(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE solutions (
    id SERIAL PRIMARY KEY,
    userId VARCHAR(64) NOT NULL REFERENCES users(userId) ON UPDATE CASCADE ON DELETE CASCADE,
    homeworkId int NOT NULL REFERENCES homeworks(id) ON UPDATE CASCADE ON DELETE CASCADE,
    courseId int NOT NULL REFERENCES courses(id) ON UPDATE CASCADE ON DELETE CASCADE,
    solutionFile BYTEA[] NOT NULL
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    userId VARCHAR(64) NOT NULL REFERENCES users(userId) ON UPDATE CASCADE ON DELETE CASCADE,
    solutionId int NOT NULL REFERENCES solutions(id) ON UPDATE CASCADE ON DELETE CASCADE,
    lecturerReview Bool NOT NULL DEFAULT false,
    percentageGrade FLOAT,
    documentation BYTEA[] 
);

CREATE TABLE reviewAudits (
    id SERIAL PRIMARY KEY,
    reviewId int NOT NULL REFERENCES reviews(id) ON UPDATE CASCADE ON DELETE CASCADE,
    resolved Bool Not NUll DEFAULT false,
    resolvedBy VARCHAR(64) REFERENCES users(userId) ON UPDATE CASCADE ON DELETE CASCADE
);