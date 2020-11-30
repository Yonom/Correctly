import moment from 'moment';
import Homework from '../models/Homework';
import { addHomework, editHomework } from '../../src/services/homeworks';
import { AUDIT_BY_LECTURERS, EFFORTS, ONE_REVIEWER, TEXTFIELD, THRESHOLD_NA } from '../../src/utils/constants';
import { addTestCourse } from '../models/Course';
import { addTestLecturer, addTestSuperuser } from '../models/User';
import { addTestStudents, getHomework, getMyEditableHomeworks } from '../utils/helpers';
import setLogin from '../utils/setLogin';

describe('manage homeworks', () => {
  test('create, edit and list homeworks', async () => {
    // create course with three students
    const course = await addTestCourse();
    const students = await addTestStudents(3);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // add a lecturer
    const lecturer = await addTestLecturer();
    await course.addAttendee({ userid: lecturer.userid, islecturer: true });

    await setLogin(lecturer);
    await addHomework(
      'Test Homework',
      [course.id],
      10,
      EFFORTS,
      ONE_REVIEWER,
      AUDIT_BY_LECTURERS,
      0,
      THRESHOLD_NA,
      [TEXTFIELD],
      [TEXTFIELD],
      moment().toDate(),
      moment().add(1, 'day').toDate(),
      moment().add(1, 'day').toDate(),
      moment().add(2, 'days').toDate(),
      null,
      null,
      null,
      null,
      null,
      null,
    );

    const [homework] = await course.getHomeworks();
    expect(homework).toEqual(new Homework({
      id: homework.id,
      refresh: homework.refresh,
      set: homework.set,
      homeworkname: 'Test Homework',
      courseid: course.id,
      maxreachablepoints: (10).toString(),
      evaluationvariant: EFFORTS,
      reviewercount: ONE_REVIEWER,
      auditors: AUDIT_BY_LECTURERS,
      samplesize: (0).toString(),
      threshold: THRESHOLD_NA.toString(),
      solutionallowedformats: [TEXTFIELD],
      reviewallowedformats: [TEXTFIELD],
      solutionstart: homework.solutionstart,
      solutionend: homework.solutionend,
      reviewstart: homework.reviewstart,
      reviewend: homework.reviewend,
      taskfiles: [null],
      taskfilenames: [null],
      samplesolutionfiles: [null],
      samplesolutionfilenames: [null],
      evaluationschemefiles: [null],
      evaluationschemefilenames: [null],
      creator: lecturer.userid,
      creationdate: homework.creationdate,
      hasdistributedreviews: false,
      hasdistributedaudits: false,
      gradespublished: false,
      gradespublishdate: null,
    }));

    await editHomework(
      'Test Homework',
      10,
      EFFORTS,
      ONE_REVIEWER,
      AUDIT_BY_LECTURERS,
      5,
      THRESHOLD_NA,
      [TEXTFIELD],
      [TEXTFIELD],
      moment().toDate(),
      moment().add(1, 'day').toDate(),
      moment().add(1, 'day').toDate(),
      moment().add(2, 'days').toDate(),
      null,
      null,
      null,
      null,
      null,
      null,
      homework.id,
    );

    await homework.refresh();
    expect(homework.samplesize).toBe((5).toString());

    const homeworkObj = await getHomework(homework.id);
    expect(homeworkObj).toEqual({
      courseYearcode: course.yearcode,
      courseTitle: course.title,
      homeworkName: homework.homeworkname,
      courseId: homework.courseid,
      maxReachablePoints: homework.maxreachablepoints,
      evaluationVariant: homework.evaluationvariant,
      reviewerCount: homework.reviewercount,
      auditors: homework.auditors,
      samplesize: homework.samplesize,
      threshold: homework.threshold,
      solutionAllowedFormats: homework.solutionallowedformats,
      reviewAllowedFormats: homework.reviewallowedformats,
      solutionStart: homework.solutionstart.toISOString(),
      solutionEnd: homework.solutionend.toISOString(),
      reviewStart: homework.reviewstart.toISOString(),
      reviewEnd: homework.reviewend.toISOString(),
      hasDistributedReviews: homework.hasdistributedreviews,
      hasDistributedAudits: homework.hasdistributedaudits,
      taskFileNames: homework.taskfilenames[0],
      sampleSolutionFileNames: homework.samplesolutionfilenames[0],
      evaluationSchemeFileNames: homework.evaluationschemefilenames[0],
      solutions: [],
      usersWithoutSolution: students.map(({ firstname, lastname, userid }) => ({ firstname, lastname, userid })),
      gradesPublished: homework.gradespublished,
      visible: true,
    });

    const lecturerHomeworks = await getMyEditableHomeworks();
    expect(lecturerHomeworks).toHaveLength(1);
    expect(lecturerHomeworks[0].id).toBe(homework.id);

    const superuser = await addTestSuperuser();
    await setLogin(superuser);
    const superuserHomeworks = await getMyEditableHomeworks();
    const filteredSuperuserHomeworks = superuserHomeworks.filter((c) => c.id === homework.id);
    expect(filteredSuperuserHomeworks).toHaveLength(1);
  });
});
