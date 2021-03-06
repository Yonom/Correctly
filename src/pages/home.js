/* Custom components */
import AppPage from '../components/AppPage';
import Tasks from '../components/home/Tasks';
import CourseModule from '../components/home/CourseModule';
import Overview from '../components/home/Overview';
import { useMyData } from '../services/auth';

/* services */
import { useMyCourses } from '../services/courses';
import { useMyHomeworks } from '../services/homeworks';
import { useMyReviews } from '../services/reviews';
import { useMyAudits } from '../services/audits';

/* utils */
import { isLecturer, isStudent } from '../utils/auth/role';
import { useOnErrorAlert } from '../utils/errors';
import { AUDIT_REASON_MISSING_REVIEW_SUBMISSION } from '../utils/constants';

const HomePage = () => {
  const { data: user } = useMyData();
  const { data: courses } = useOnErrorAlert(useMyCourses());
  const { data: openHomeworks } = useOnErrorAlert(useMyHomeworks());
  const { data: openReviews } = useOnErrorAlert(useMyReviews());
  const { data: openAudits } = useOnErrorAlert(useMyAudits());
  const { loggedIn, role } = user ?? {};

  const pageContent = [];
  if (loggedIn) {
    const tasks = [];

    const auditsToShow = openAudits?.filter((a) => a.reason !== AUDIT_REASON_MISSING_REVIEW_SUBMISSION);
    const lecturerReviewsToShow = openAudits?.filter((a) => a.reason === AUDIT_REASON_MISSING_REVIEW_SUBMISSION) ?? [];
    const reviewsToShow = lecturerReviewsToShow.concat(openReviews ?? []);

    if (isStudent(role) || openHomeworks?.length > 0) {
      tasks.push(<Tasks type="open-homework" title="Open Homework" homeworklist={openHomeworks} />);
    }

    tasks.push(<Tasks type="open-review" title="Open Reviews" homeworklist={reviewsToShow} />);

    if (isLecturer(role) || auditsToShow?.length > 0) {
      tasks.push(<Tasks type="open-audit" title="Open Audits" homeworklist={auditsToShow} />);
    }

    const overviewTasks = <Overview key={1} title="To Do" content={tasks} size={12} />;

    /* Push Tasklists to PageContent */
    pageContent.push(overviewTasks);

    /* create courses with coursemodel component */
    const coursemodules = [];

    /* create course object */
    courses?.forEach((course) => {
      coursemodules.push(
        <CourseModule course={course} />,
      );
    });

    const overviewKurse = <Overview key={2} title="Courses" content={coursemodules} size={6} />;

    /* Push Courses to PageContent(mobile) */
    pageContent.push(overviewKurse);
  }

  return (
    <AppPage title="Home" footer="Correctly">
      <div className="">
        {pageContent}
      </div>
    </AppPage>
  );
};
export default HomePage;
