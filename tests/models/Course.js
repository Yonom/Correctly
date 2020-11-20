import moment from 'moment';
import { deleteFrom, insertInto, selectFrom } from '../utils/sqlBuilder';
import { EFFORTS, ONE_REVIEWER, AUDIT_BY_LECTURERS, TEXTFIELD } from '../../src/utils/constants';
import Homework from './Homework';
import { addCleanupTask } from '../utils/jest.setup';

class Course {
  constructor(obj) {
    Object.assign(this, obj);
  }

  async addAttendee({
    userid,
    courseid = this.id,
    isstudent = false,
    islecturer = false,
    ismodulecoordinator = false,
  }) {
    return insertInto('attends', userid, courseid, isstudent, islecturer, ismodulecoordinator);
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
    threshold = -1,
    solutionallowedformats = [TEXTFIELD],
    reviewallowedformats = [TEXTFIELD],
    solutionstart = moment(),
    solutionend = moment().add(1, 'day'),
    reviewstart = moment().add(1, 'day'),
    reviewend = moment().add(2, 'days'),
    taskfiles = [null],
    taskfilenames = [null],
    samplesolutionfiles = [null],
    samplesolutionfilenames = [null],
    evaluationschemefiles = [null],
    evaluationschemefilenames = [null],
    creator = 'TRZhASY8Figbt9YKoG0rvP4XOCE3', // Dozent Eins
    creationdate = new Date(),
    hasdistributedreviews = false,
    hasdistributedaudits = false,
    gradespublished = false,
  } = {}) {
    return new Homework(
      await insertInto('homeworks', homeworkname, courseid, maxreachablepoints, evaluationvariant, reviewercount, auditors, samplesize, threshold, solutionallowedformats, reviewallowedformats, solutionstart, solutionend, reviewstart, reviewend, taskfiles, taskfilenames, samplesolutionfiles, samplesolutionfilenames, evaluationschemefiles, evaluationschemefilenames, creator, creationdate, hasdistributedreviews, hasdistributedaudits, gradespublished),
    );
  }

  async getHomeworks() {
    const homeworkObjs = await selectFrom('homeworks', 'courseid', this.id);
    return homeworkObjs.map((h) => new Homework(h));
  }
}

const deleteCourse = async ({ id }) => {
  return deleteFrom('courses', 'id', id);
};

const addTestCourse = async ({
  title = 'Test Course',
  yearcode = 'ABC-123',
} = {}) => {
  const course = await insertInto('courses', title, yearcode);

  // delete this course after tests have run
  addCleanupTask(async () => await deleteCourse(course));

  return new Course(course);
};

export default addTestCourse;
