ALTER TABLE reviews ADD COLUMN issystemreview BOOL NOT NULL DEFAULT true;
ALTER TABLE reviews RENAME COLUMN lecturerreview TO islecturerreview;
ALTER TABLE reviews RENAME COLUMN submitted TO issubmitted;
ALTER TABLE audits RENAME COLUMN resolved TO isresolved;
