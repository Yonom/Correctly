import moment from 'moment';
import { AUDIT_REASON_THRESHOLD } from '../../src/utils/constants';
import { insertInto, selectFrom } from '../utils/sqlBuilder';

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
    reviewfiles = [null],
    reviewfilenames = [null],
    submitdate = moment(),
    issystemreview = false,
    reviewcomment = null,
  }) {
    return insertInto('reviews', userid, solutionid, islecturerreview, issubmitted, percentagegrade, reviewfiles, reviewfilenames, submitdate, issystemreview, reviewcomment);
  }

  async getReviews() {
    return selectFrom('reviews', 'solutionid', this.id);
  }

  async addAudit({
    solutionid = this.id,
    reason = AUDIT_REASON_THRESHOLD,
    isresolved = false,
    resolvedby = null,
    resolveddate = null,
  } = {}) {
    return insertInto('audits', solutionid, reason, isresolved, resolvedby, resolveddate);
  }

  async getAudits() {
    return selectFrom('audits', 'solutionid', this.id);
  }
}
