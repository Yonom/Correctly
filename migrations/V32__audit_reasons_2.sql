
ALTER TABLE public.audits DROP CONSTRAINT IF EXISTS check_reason_reason_reason_reason_reason;
ALTER TABLE public.audits ADD CONSTRAINT check_reason_reason_reason_reason_reason_reason CHECK (
  reason='threshold' or 
  reason='samplesize' or 
  reason='missing-review-submission' or
  reason='partially-missing-review-submission' or
  reason='did-not-submit-review' or
  reason='plagiarism'
);