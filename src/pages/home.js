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

const HomePage = () => {
  const taskTitles = [];
  const pageContent = [];

  const { data: user } = useMyData();
  const { data: courses } = useOnErrorAlert(useMyCourses());
  const { data: openHomeworks } = useOnErrorAlert(useMyHomeworks());
  const { data: openReviews } = useOnErrorAlert(useMyReviews());
  const { data: openAudits } = useOnErrorAlert(useMyAudits());

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
      taskTitles.push('Open Homeworks');
      taskTitles.push('Proofreading');
      taskCorrect = <Tasks title={taskTitles[1]} homeworklist={openAudits} />;
    }

    /* Load components */
    const tasks = [];
    const taskDo = <Tasks title={taskTitles[0]} homeworklist={openHomeworks} />;

    tasks.push(taskDo, taskCorrect);

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
      {loggedIn && (
        loadpage())}
      <div className="">
        {pageContent}
      </div>
    </AppPage>
  );
};
export default HomePage;
