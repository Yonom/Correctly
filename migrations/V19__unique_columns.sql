ALTER TABLE audits ADD CONSTRAINT solution_unique UNIQUE (solutionid);
ALTER TABLE solutions ADD CONSTRAINT user_homework_unique UNIQUE (userid, homeworkid);
