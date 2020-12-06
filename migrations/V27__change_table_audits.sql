DROP TABLE audits;
CREATE TABLE audits (
  id SERIAL PRIMARY KEY,
  solutionId int NOT NULL REFERENCES solutions(id) ON UPDATE CASCADE ON DELETE CASCADE,
  reason VARCHAR(64) NOT NULL CHECK (
    reason='threshold' or 
    reason='samplesize' or 
    reason='missing-review-submission' or
    reason='plagiarism'
  ) NOT NULL,
  isresolved BOOLEAN NOT NUll DEFAULT false,
  resolvedBy VARCHAR(64) REFERENCES users(userId) ON UPDATE CASCADE ON DELETE CASCADE,
  resolvedDate TIMESTAMPTZ
);
ALTER TABLE audits ADD CONSTRAINT solution_unique UNIQUE (solutionid);