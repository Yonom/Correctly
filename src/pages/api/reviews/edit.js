import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import updateReview from '../../../services/api/database/review';
import authMiddleware from '../../../utils/api/auth/authMiddleware';

const editReview = async (req, res, { userId }) => {
  // Prüfung auf POST-Request
  await handleRequestMethod(req, res, 'POST');

  const { id } = req.body || {};

  // Logik-Check der empfangenen Werte (z.B. erreichte Punktzahl <= max. mögliche Punktzahl)

  // Berechnung der Werte zum Updaten der reviews Tabelle

  await updateReview(id, userId);
  return res.status(200).json({});
};

export default authMiddleware(editReview);
