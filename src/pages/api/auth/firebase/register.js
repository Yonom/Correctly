import { firebaseAdminAuth } from '../../../../services/api/firebaseAdmin';

export default async (req, res) => {
  const {
    token,
    firstName,
    lastName,
    studentId,
  } = req.body || {};

  try {
    const decoded = await firebaseAdminAuth.verifyIdToken(token);

    // TODO update users table
    (() => {})(decoded.uid, decoded.email, firstName, lastName, studentId, decoded.email_verified);

    return res.status(200).json({ });
  } catch (err) {
    return res.status(403).json({ error: 'Invalid credentials sent!', err });
  }
};
