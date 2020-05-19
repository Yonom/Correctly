import handleRequestMethod from '../../../utils/api/handleReq';
import insertHomework from '../../../services/api/database/homework';

export default async (req, res) => {
  // make sure this is a POST call
  handleRequestMethod(req, res, 'POST');

  // get parameters
  const { exercise, solution, evaluation, doingStart, doingEnd, correctingStart, correctingEnd, dataFormat, correctingType, correctingAmountStudent, correctingAmountProf, criticalEvaluation } = req.body;

  await insertHomework(exercise, solution, evaluation, doingStart, doingEnd, correctingStart, correctingEnd, dataFormat, correctingType, correctingAmountStudent, correctingAmountProf, criticalEvaluation);


  // empty json to confirm success
  return res.json({});
};
