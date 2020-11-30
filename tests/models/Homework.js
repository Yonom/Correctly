import moment from 'moment';
import { insertInto, selectFrom } from '../utils/sqlBuilder';
import Solution from './Solution';

export default class Homework {
  constructor(obj) {
    Object.assign(this, obj);
  }

  async addSolution({
    userid,
    homeworkid = this.id,
    solutionfiles = [null],
    solutionfilenames = [null],
    submitdate = moment(),
    solutioncomment = Math.random().toString(), // bypass plagiarism check
  }) {
    return new Solution(
      await insertInto('solutions', userid, homeworkid, solutionfiles, solutionfilenames, submitdate, solutioncomment),
    );
  }

  async getSolutions() {
    const solutionObjs = await selectFrom('solutions', 'homeworkid', this.id);
    return solutionObjs.map((s) => new Solution(s));
  }
}
