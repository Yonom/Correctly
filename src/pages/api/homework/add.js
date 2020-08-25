import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import insertHomework from '../../../services/api/database/homework';

const addHomework = async (req, res) => {
  // make sure this is a POST call
  await handleRequestMethod(req, res, 'POST');

  // get parameters
  const {
    exercise,
    solution,
    evaluation,
    doingStart,
    doingEnd,
    correctingStart,
    correctingEnd,
    dataFormat,
    correctingType,
    correctingAmountStudent,
    correctingAmountProf,
    criticalEvaluation,
  } = req.body;

  await insertHomework(
    exercise,
    solution,
    evaluation,
    doingStart,
    doingEnd,
    correctingStart,
    correctingEnd,
    dataFormat,
    correctingType,
    correctingAmountStudent,
    correctingAmountProf,
    criticalEvaluation,
  );

  // empty json to confirm success
  return res.json({});
};

export default addHomework;
