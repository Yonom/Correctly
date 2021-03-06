import moment from 'moment';
import { AUDIT_REASON_THRESHOLD } from '../../src/utils/constants';
import { insertInto, selectFrom } from '../utils/sqlBuilder';
import Review from './Review';

export default class Solution {
  constructor(obj) {
    Object.assign(this, obj);
  }

  async addReview({
    userid,
    solutionid = this.id,
    islecturerreview = false,
    issubmitted = false,
    percentagegrade = null,
    reviewfiles = null,
    reviewfilenames = null,
    submitdate = null,
    issystemreview = false,
    reviewcomment = null,
    creationdate = moment(),
    isvisible = true,
  }) {
    return new Review(
      await insertInto('reviews', userid, solutionid, islecturerreview, issubmitted, percentagegrade, reviewfiles, reviewfilenames, submitdate, issystemreview, reviewcomment, creationdate, isvisible),
    );
  }

  async getReviews() {
    const reviewObjs = await selectFrom('reviews', 'solutionid', this.id);
    return reviewObjs.map((s) => new Review(s));
  }

  async addAudit({
    solutionid = this.id,
    reason = AUDIT_REASON_THRESHOLD,
    isresolved = false,
    resolvedby = null,
    resolveddate = null,
    creationdate = moment(),
    plagiarismid = null,
  } = {}) {
    return await insertInto('audits', solutionid, reason, isresolved, resolvedby, resolveddate, creationdate, plagiarismid);
  }

  async getAudits() {
    return await selectFrom('audits', 'solutionid', this.id);
  }
}
