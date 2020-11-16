import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { updateReview, selectHomeworkReviewAllowedFormatsForReviewAndUser } from '../../../services/api/database/review';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyFileNameAllowedFormats, verifyFileNameSize, verifyFileSize } from '../../../utils/api/isCorrectFileSize';
import { fromBase64 } from '../../../utils/api/serverFileUtils';
import withSentry from '../../../utils/api/withSentry';

const editReviewAPI = async (req, res, { userId }) => {
  // Prüfung auf POST-Request
  await handleRequestMethod(req, res, 'POST');

  const {
    reviewId,
    percentageGrade,
    reviewFiles,
    reviewFileNames,
    reviewComment,
  } = req.body || {};

  // Logik-Check der empfangenen Werte (z.B. erreichte Punktzahl <= max. mögliche Punktzahl)
  if (percentageGrade < 0 || percentageGrade > 100) {
    return res.status(400).json({ code: 'review/invalid-data' });
  }

  const allowedFormats = await selectHomeworkReviewAllowedFormatsForReviewAndUser(reviewId, userId);
  if (allowedFormats === null) {
    return res.status(404).json({ code: 'review/not-found' });
  }

  try {
    verifyFileSize(reviewFiles);
    verifyFileNameSize(reviewFileNames);
    verifyFileNameAllowedFormats(reviewFileNames, allowedFormats);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  // Berechnung der Werte zum Updaten der reviews Tabelle
  const query = await updateReview(
    reviewId,
    userId,
    percentageGrade,
    fromBase64(reviewFiles),
    reviewFileNames,
    reviewComment,
  );

  if (query.rowCount === 0) {
    return res.status(404).json({ code: 'review/not-found' });
  }

  return res.status(200).json({});
};

export default withSentry(authMiddleware(editReviewAPI));
