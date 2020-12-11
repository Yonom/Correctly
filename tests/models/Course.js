import moment from 'moment';
import { deleteFrom, insertInto, selectFrom } from '../utils/sqlBuilder';
import { EFFORTS, ONE_REVIEWER, AUDIT_BY_LECTURERS, TEXTFIELD, THRESHOLD_NA } from '../../src/utils/constants';
import Homework from './Homework';
import { addCleanupTask } from '../utils/jest.setup';
import { getDefaultLecturer } from './User';

export default class Course {
  constructor(obj) {
    Object.assign(this, obj);
  }

  async addAttendee({
    userid,
    courseid = this.id,
    isstudent = false,
    islecturer = false,
    ismodulecoordinator = false,
    creationdate = moment(),
  }) {
    return insertInto('attends', userid, courseid, isstudent, islecturer, ismodulecoordinator, creationdate);
  }

  async getAttendees() {
    return selectFrom('attends', 'courseid', this.id);
  }

  async addHomework({
    homeworkname = 'Test Homework',
    courseid = this.id,
    maxreachablepoints = 10,
    evaluationvariant = EFFORTS,
    reviewercount = ONE_REVIEWER,
    auditors = AUDIT_BY_LECTURERS,
    samplesize = 0,
    threshold = THRESHOLD_NA,
    solutionallowedformats = [TEXTFIELD],
    reviewallowedformats = [TEXTFIELD],
    solutionstart = moment(),
    solutionend = moment().add(1, 'day'),
    reviewstart = moment().add(1, 'day'),
    reviewend = moment().add(2, 'days'),
    taskfiles = ['Task.pdf'],
    taskfilenames = ['Task Contents'],
    samplesolutionfiles = ['Sample Solution.pdf'],
    samplesolutionfilenames = ['Sample Solution Contents'],
    evaluationschemefiles = ['Evaluation Scheme.pdf'],
    evaluationschemefilenames = ['Evaluation Scheme Contents'],
    creator,
    creationdate = moment(),
    hasdistributedreviews = false,
    hasdistributedaudits = false,
    gradespublished = false,
    gradespublishdate = null,
  } = {}) {
    return new Homework(
      await insertInto('homeworks', homeworkname, courseid, maxreachablepoints, evaluationvariant, reviewercount, auditors, samplesize, threshold, solutionallowedformats, reviewallowedformats, solutionstart, solutionend, reviewstart, reviewend, taskfiles, taskfilenames, samplesolutionfiles, samplesolutionfilenames, evaluationschemefiles, evaluationschemefilenames, creator ?? (await getDefaultLecturer()).userid, creationdate, hasdistributedreviews, hasdistributedaudits, gradespublished, gradespublishdate),
    );
  }

  async getHomeworks() {
    const homeworkObjs = await selectFrom('homeworks', 'courseid', this.id);
    return homeworkObjs.map((h) => new Homework(h));
  }
}

export const deleteCourse = async ({ id }) => {
  return deleteFrom('courses', 'id', id);
};

export const addTestCourse = async ({
  title = 'Test Course',
  creationdate = moment(),
} = {}) => {
  const course = await insertInto('courses', title, `TEST-${Math.random()}`, creationdate);

  // delete this course after tests have run
  addCleanupTask(async () => await deleteCourse(course));

  return new Course(course);
};
