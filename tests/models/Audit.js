import moment from 'moment';

export default class Audit {
  constructor(obj) {
    Object.assign(this, obj);
  }

  async resolve({
    isresolved = true,
    resolvedby,
    resolveddate = moment(),
  }) {
    return this.set({
      isresolved,
      resolvedby,
      resolveddate,
    });
  }
}
