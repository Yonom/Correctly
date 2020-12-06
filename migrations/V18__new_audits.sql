DROP TABLE reviewAudits;

CREATE TABLE audits (
  id SERIAL PRIMARY KEY,
  solutionId int NOT NULL REFERENCES solutions(id) ON UPDATE CASCADE ON DELETE CASCADE,
  reason VARCHAR(64) NOT NULL CHECK (
    reason='threshold' or 
    reason='samplesize' or 
    reason='missing-review-submission'
  ) NOT NULL,
  resolved BOOLEAN NOT NUll DEFAULT false,
  resolvedBy VARCHAR(64) REFERENCES users(userId) ON UPDATE CASCADE ON DELETE CASCADE,
  resolvedDate TIMESTAMPTZ
);

ALTER TABLE attends ADD CONSTRAINT course_user_unique UNIQUE (userid, courseid);
