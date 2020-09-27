/* Custom components */
import AppPage from '../components/AppPage';
import Tasks from '../components/home/Tasks';
import CourseModule from '../components/home/CourseModul';
import Overview from '../components/home/Overview';
import { useMyData } from '../services/auth';

/* authentification functions */

/* services */
import { useCourses, useHomeworks, useReviews, useReviewAudits } from '../services/users';

/* utils */
import { isLecturer, isStudent } from '../utils/auth/role';
import { useOnErrorAlert } from '../utils/errors';

const HomePage = () => {
  const taskTitles = [];
  const pageContent = [];

  const { data: user } = useMyData();
  const { data: courses } = useOnErrorAlert(useCourses());
  const { data: openHomeworks } = useOnErrorAlert(useHomeworks());
  const { data: openReviews } = useOnErrorAlert(useReviews());
  const { data: openReviewAudits } = useOnErrorAlert(useReviewAudits());

  const { loggedIn, role } = user ?? {};

  /**
   *
   */
  function loadpage() {
    /* Load role text */
    let taskCorrect;
    if (isStudent(role)) {
      taskTitles.push('Homeworks');
      taskTitles.push('Reviews');
      taskCorrect = <Tasks title={taskTitles[1]} homeworklist={openReviews} />;
    } else if (isLecturer(role)) {
      taskTitles.push('Open homeworks');
      taskTitles.push('Proofreading');
      taskCorrect = <Tasks title={taskTitles[1]} homeworklist={openReviewAudits} />;
    }

    /* Load components */
    const tasks = [];
    const taskDo = <Tasks title={taskTitles[0]} homeworklist={openHomeworks} />;

    tasks.push(taskDo, taskCorrect);

    const overviewTasks = <Overview key={1} title="To do" content={tasks} />;

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

    const overviewKurse = <Overview key={2} title="Courses" content={coursemodules} />;

    /* Push Courses to PageContent(mobile) */
    pageContent.push(overviewKurse);
  }

  return (
    <AppPage title="home" footer="Correctly">
      {loggedIn && (
        loadpage())}
      <div className="">
        {pageContent}
      </div>
    </AppPage>
  );
};
export default HomePage;
