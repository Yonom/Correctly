DROP TABLE IF EXISTS homeworks,refers,reviews,solutions,reviewAudits;

CREATE TABLE homeworks 
(
    id SERIAL PRIMARY KEY,
    homeworkName VARCHAR(64) NOT NULL,
    courseId int NOT NULL REFERENCES courses(id) ON UPDATE CASCADE ON DELETE CASCADE,
    maxReachablePoints INTEGER NOT NULL,
    evaluationVariant VARCHAR(64) NOT NULL,
    correctionVariant VARCHAR(64) NOT NULL,
    correctionValidation VARCHAR(64) NOT NULL,
    samplesize INTEGER NOT NULL,
    threshold INTEGER NOT NULL,
    solutionAllowedFormats VARCHAR(64)[] NOT NULL,
    correctionAllowedFormats VARCHAR(64)[] NOT NULL,
    doingStart TIMESTAMPTZ NOT NULL,
    doingEnd TIMESTAMPTZ NOT NULL,
    correctingStart TIMESTAMPTZ NOT NULL,
    correctingEnd TIMESTAMPTZ NOT NULL,
    exerciseAssignment BYTEA[] NOT NULL,
    exerciseAssignmentName VARCHAR(64)[] NOT NULL,
    modelSolution BYTEA[],
    modelSolutionName VARCHAR(64)[],
    evaluationScheme BYTEA[],
    evaluationSchemeName VARCHAR(64)[],
    creator VARCHAR(64) NOT NULL REFERENCES users(userId) ON UPDATE CASCADE ON DELETE CASCADE,
    creationDate TIMESTAMPTZ NOT NULL,
    distributedReviews BOOLEAN NOT NUll DEFAULT false,
    distributedReviewAudits BOOLEAN NOT NUll DEFAULT false
);

CREATE TABLE solutions (
    id SERIAL PRIMARY KEY,
    userId VARCHAR(64) NOT NULL REFERENCES users(userId) ON UPDATE CASCADE ON DELETE CASCADE,
    homeworkId int NOT NULL REFERENCES homeworks(id) ON UPDATE CASCADE ON DELETE CASCADE,
    solutionFile BYTEA[] NOT NULL,
    solutionFileName VARCHAR(64)[] NOT NULL,
    submitDate TIMESTAMPTZ NOT NULL
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    userId VARCHAR(64) NOT NULL REFERENCES users(userId) ON UPDATE CASCADE ON DELETE CASCADE,
    solutionId int NOT NULL REFERENCES solutions(id) ON UPDATE CASCADE ON DELETE CASCADE,
    lecturerReview BOOLEAN NOT NULL DEFAULT false,
    submitted BOOLEAN NOT NUll DEFAULT false,
    percentageGrade FLOAT,
    documentation BYTEA[],
    documentationFileName VARCHAR(64)[],
    submitDate TIMESTAMPTZ
);

CREATE TABLE reviewAudits (
    id SERIAL PRIMARY KEY,
    reviewId int NOT NULL REFERENCES reviews(id) ON UPDATE CASCADE ON DELETE CASCADE,
    resolved BOOLEAN NOT NUll DEFAULT false,
    resolvedBy VARCHAR(64) REFERENCES users(userId) ON UPDATE CASCADE ON DELETE CASCADE,
    resolvedDate TIMESTAMPTZ
);