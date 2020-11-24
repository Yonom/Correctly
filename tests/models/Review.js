import moment from 'moment';

export default class Review {
  constructor(obj) {
    Object.assign(this, obj);
  }

  async submit({
    issubmitted = true,
    percentagegrade = 100,
    reviewfiles = [null],
    reviewfilenames = [null],
    submitdate = moment(),
    reviewcomment = null,
  } = {}) {
    return this.set({
      issubmitted,
      percentagegrade,
      reviewfiles,
      reviewfilenames,
      submitdate,
      reviewcomment,
    });
  }
}
