ALTER TABLE public.homeworks RENAME COLUMN exerciseassignmentname TO taskfilenames;
ALTER TABLE public.homeworks RENAME COLUMN exerciseassignment TO taskfiles;
ALTER TABLE public.homeworks RENAME COLUMN correctingstart TO reviewstart;
ALTER TABLE public.homeworks RENAME COLUMN correctingend TO reviewend;
ALTER TABLE public.homeworks RENAME COLUMN modelsolutionname TO samplesolutionfilenames;
ALTER TABLE public.homeworks RENAME COLUMN modelsolution TO samplesolutionfiles;
ALTER TABLE public.homeworks RENAME COLUMN correctionallowedformats TO reviewallowedformats;
ALTER TABLE public.homeworks RENAME COLUMN correctionvalidation TO auditors;
ALTER TABLE public.homeworks RENAME COLUMN correctionvariant TO reviewercount;
ALTER TABLE public.homeworks RENAME COLUMN doingend TO solutionend;
ALTER TABLE public.homeworks RENAME COLUMN doingstart TO solutionstart;
ALTER TABLE public.homeworks RENAME COLUMN evaluationscheme TO evaluationschemefiles;
ALTER TABLE public.homeworks RENAME COLUMN evaluationschemename TO evaluationschemefilenames;

ALTER TABLE public.solutions RENAME COLUMN solutionfile TO solutionfiles;
ALTER TABLE public.solutions RENAME COLUMN solutionfilename TO solutionfilenames;

ALTER TABLE public.reviews RENAME COLUMN documentation TO reviewfile;
ALTER TABLE public.reviews RENAME COLUMN documentationfilename TO reviewfilename;
ALTER TABLE public.reviews RENAME COLUMN documentationcomment TO reviewcomment;
